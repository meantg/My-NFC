import {Buffer} from 'buffer';
import NfcManager, {Ndef, NfcTech} from 'react-native-nfc-manager';

export const validateEmail = email => {
  if (!email || typeof email !== 'string') return false;

  const trimmedEmail = email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) return false;

  const [localPart, domain] = trimmedEmail.split('@');
  if (localPart.length === 0 || localPart.length > 64) return false;
  if (domain.length === 0 || domain.length > 253) return false;

  const domainRegex =
    /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!domainRegex.test(domain)) return false;

  const tldRegex = /\.[a-zA-Z]{2,}$/;
  return tldRegex.test(domain);
};

export const validateEmailSimple = email => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const hexToRgb = hex => {
  // Remove the '#' if present
  hex = hex.replace(/^#/, '');

  // Parse shorthand hex (e.g., "03F") into full form ("0033FF")
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(char => char + char)
      .join('');
  }

  // Convert to RGB
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return {r, g, b};
};

/* eslint-disable no-bitwise */

const pack = [0xaa, 0xbb];

function passwordStringToHexBytes(password) {
  if (password.length !== 4) {
    throw new Error('Password must be exactly 4 characters');
  }
  return Array.from(password).map(char => char.charCodeAt(0));
}

export async function ensurePasswordProtection(pass = '1234') {
  const password = passwordStringToHexBytes(pass);
  await NfcManager.requestTechnology(NfcTech.NfcA);
  let respBytes = null;
  let writeRespBytes = null;
  let authPageIdx;

  // check if this is NTAG 213 or NTAG 215
  respBytes = await NfcManager.nfcAHandler.transceive([0x30, 0]);
  const cc2 = respBytes[14];
  if (cc2 * 8 > 256) {
    authPageIdx = 131; // NTAG 215
  } else {
    authPageIdx = 41; // NTAG 213
  }

  // check if AUTH is enabled
  respBytes = await NfcManager.nfcAHandler.transceive([0x30, authPageIdx]);
  const auth = respBytes[3];

  if (auth === 255) {
    // configure the tag to support password protection
    writeRespBytes = await NfcManager.nfcAHandler.transceive([
      0xa2,
      authPageIdx + 3,
      ...pack,
      respBytes[14],
      respBytes[15],
    ]);
    console.warn(writeRespBytes);

    writeRespBytes = await NfcManager.nfcAHandler.transceive([
      0xa2,
      authPageIdx + 2,
      ...password,
    ]);
    console.warn(writeRespBytes);

    writeRespBytes = await NfcManager.nfcAHandler.transceive([
      0xa2,
      authPageIdx + 1,
      respBytes[4] & 0x7f,
      respBytes[5],
      respBytes[6],
      respBytes[7],
    ]);
    console.warn(writeRespBytes);

    writeRespBytes = await NfcManager.nfcAHandler.transceive([
      0xa2,
      authPageIdx,
      respBytes[0],
      respBytes[1],
      respBytes[2],
      4,
    ]);
    console.warn(writeRespBytes);
  } else {
    // send password to NFC tags, so we can perform write operations
    writeRespBytes = await NfcManager.nfcAHandler.transceive([
      0x1b,
      ...password,
    ]);
    console.warn(writeRespBytes);
    if (writeRespBytes[0] !== pack[0] || writeRespBytes[1] !== pack[1]) {
      throw new Error('incorrect password');
    }
  }
  await NfcManager.cancelTechnologyRequest();
}

export async function removePasswordProtection(pass = '1234') {
  try {
    const password = passwordStringToHexBytes(pass);
    await NfcManager.requestTechnology(NfcTech.NfcA);
    console.log('✅ NFC-A requested');

    // Authenticate
    const authResp = await NfcManager.nfcAHandler.transceive([
      0x1b,
      ...password,
    ]);
    console.log('🔐 Auth Response:', authResp);

    if (authResp[0] !== pack[0] || authResp[1] !== pack[1]) {
      throw new Error('❌ Incorrect password or PACK mismatch');
    }

    // Read page 0x82 (contains AUTH0)
    const configResp = await NfcManager.nfcAHandler.transceive([0x30, 0x82]);
    console.log('📄 Config Page 0x82:', configResp);

    // Prepare new page with AUTH0 = 0xFF (3rd byte)
    const newPage = [configResp[0], configResp[1], 0xff, configResp[3]];
    const writeResp = await NfcManager.nfcAHandler.transceive([
      0xa2,
      0x82,
      ...newPage,
    ]);
    console.log('✍️ AUTH0 Update Response:', writeResp);

    // Optional: Clear PWD and PACK
    const pwdResp = await NfcManager.nfcAHandler.transceive([
      0xa2, 0x83, 0xff, 0xff, 0xff, 0xff,
    ]);
    console.log('🧽 Clear PWD Response:', pwdResp);

    const packResp = await NfcManager.nfcAHandler.transceive([
      0xa2, 0x84, 0x00, 0x00, 0xff, 0xff,
    ]);
    console.log('🧽 Clear PACK Response:', packResp);

    console.log('✅ Protection removed successfully');
  } catch (err) {
    console.warn('❌ Failed to remove password:', err);
  } finally {
    await NfcManager.cancelTechnologyRequest();
  }
}

function parseRecord(record) {
  const payload = Buffer.from(record.payload);
  const tnf = record.tnf;
  const type = Buffer.from(record.type).toString();

  // URI
  if (type === 'U') {
    const prefixMap = [
      '',
      'http://www.',
      'https://www.',
      'http://',
      'https://',
      'tel:',
      'mailto:',
      'ftp://anonymous:anonymous@',
      'ftp://ftp.',
      'ftps://',
      'sftp://',
      'smb://',
      'nfs://',
      'ftp://',
      'dav://',
      'news:',
      'telnet://',
      'imap:',
      'rtsp://',
      'urn:',
      'pop:',
      'sip:',
      'sips:',
      'tftp:',
      'btspp://',
      'btl2cap://',
      'btgoep://',
      'tcpobex://',
      'irdaobex://',
      'file://',
      'urn:epc:id:',
      'urn:epc:tag:',
      'urn:epc:pat:',
      'urn:epc:raw:',
      'urn:epc:',
      'urn:nfc:',
    ];
    const prefixIndex = payload[0];
    const uri = prefixMap[prefixIndex] + payload.slice(1).toString();
    return {type: 'URI', value: uri};
  }

  // TEXT
  if (type === 'T') {
    const langLength = payload[0];
    const langCode = payload.slice(1, 1 + langLength).toString();
    const text = payload.slice(1 + langLength).toString();
    return {type: 'Text', lang: langCode, value: text};
  }

  return {type: 'Unknown', raw: payload.toString('utf8')};
}

export async function readTag() {
  try {
    await NfcManager.requestTechnology(NfcTech.NfcA);
    const tag = await NfcManager.getTag();

    const id = tag.id?.toUpperCase();
    const tech = tag.tech || 'Unknown';

    // Read first 16 pages
    const pages = await NfcManager.nfcAHandler.transceive([0x30, 0x00]);

    const atqa = tag?.techInfos?.NfcA?.atqa || [0x00, 0x00];
    const sak = tag?.techInfos?.NfcA?.sak || 0x00;

    // CC Byte
    const ccByte = pages[14];
    const totalBytes = ccByte * 8;
    const totalPages = totalBytes / 4;

    // AUTH0 detection
    let passwordProtected = false;
    try {
      const authBytes = await NfcManager.nfcAHandler.transceive([0x30, 131]);
      const auth0 = authBytes[3];
      passwordProtected = auth0 !== 0xff;
    } catch (authErr) {
      console.warn('Failed to read AUTH0:', authErr);
    }

    // Parse all NDEF Records
    const records = (tag.ndefMessage || []).map(rec => parseRecord(rec));
    console.log('tag.ndefMessage', tag.ndefMessage);

    const tagInfo = {
      tagType: 'ISO 14443-3A',
      chip: 'NXP - NTAG215',
      tech: 'Type A',
      serialNumber: id,
      atqa: `0x${atqa.map(b => b.toString(16).padStart(2, '0')).join('')}`,
      sak: `0x${sak.toString(16).padStart(2, '0')}`,
      passwordProtected,
      memoryInfo: `${totalBytes} bytes : ${totalPages} pages (4 bytes each)`,
      dataFormat: 'NFC Forum Type 2',
      size: `${
        tag.ndefMessage?.[0]?.payload?.length || 0
      } / ${totalBytes} Bytes`,
      writable: tag.isWritable !== false,
      records, // All parsed records
    };

    return tagInfo;
  } catch (e) {
    console.warn('Read error', e);
    return null;
  } finally {
    await NfcManager.cancelTechnologyRequest();
  }
}

export async function writeNdefMessageWithAuth(pass = '1234') {
  const password = passwordStringToHexBytes(pass);

  await NfcManager.requestTechnology(NfcTech.NfcA);
  let respBytes = null;
  let writeRespBytes = null;
  let authPageIdx;
  let writeStatus = false;

  try {
    // Step 1: Read page 0 to determine tag type
    respBytes = await NfcManager.nfcAHandler.transceive([0x30, 0]);
    const cc2 = respBytes[14];
    authPageIdx = cc2 * 8 > 256 ? 131 : 41;

    // Step 2: Read the AUTH0 value to determine if password protection is enabled
    respBytes = await NfcManager.nfcAHandler.transceive([0x30, authPageIdx]);
    const auth = respBytes[3];

    if (auth === 0xff) {
      console.log('🔐 Enabling password protection...');
      await NfcManager.nfcAHandler.transceive([
        0xa2,
        authPageIdx + 3,
        ...pack,
        respBytes[14],
        respBytes[15],
      ]);
      await NfcManager.nfcAHandler.transceive([
        0xa2,
        authPageIdx + 2,
        ...password,
      ]);
      await NfcManager.nfcAHandler.transceive([
        0xa2,
        authPageIdx + 1,
        respBytes[4] & 0x7f,
        respBytes[5],
        respBytes[6],
        respBytes[7],
      ]);
      await NfcManager.nfcAHandler.transceive([
        0xa2,
        authPageIdx,
        respBytes[0],
        respBytes[1],
        respBytes[2],
        4,
      ]);
    } else {
      console.log('🔓 Authenticating with password...');
      writeRespBytes = await NfcManager.nfcAHandler.transceive([
        0x1b,
        ...password,
      ]);

      if (
        pack.length === 2 &&
        (writeRespBytes[0] !== pack[0] || writeRespBytes[1] !== pack[1])
      ) {
        throw new Error('❌ Incorrect password');
      }
    }

    // // Step 3: Use standard NDEF writing
    console.log('📝 Writing NDEF message using standard method...');
    await writeMultipleRecordsWithNfcA().then(res => {
      if (!res) {
        writeStatus = false;
      } else {
        writeStatus = true;
      }
    });
    console.log('✅ NDEF message written successfully using standard method!');
  } catch (err) {
    console.warn('❌ Error during NFC write:', err);
    await NfcManager.setAlertMessage(err.message);
    writeStatus = false;
  } finally {
    await NfcManager.cancelTechnologyRequest();
    return writeStatus;
  }
}

function buildMultiRecordNdef() {
  return Ndef.encodeMessage([
    Ndef.uriRecord('https://facebook.com/meantgx'),
    Ndef.uriRecord('mailto:thangvm199@gmail.com?subject=bello&body=Amazing'),
    Ndef.uriRecord('tel:0379221432'),
    Ndef.textRecord('Test text'),
    Ndef.textRecord('Test text'),
    Ndef.textRecord('Test text'),
    Ndef.uriRecord('https://youtube.com'),
    Ndef.uriRecord('https://youtube.com'),
  ]);
}

export async function writeMultipleRecordsWithNfcA() {
  let writeStatus = false;
  try {
    // await NfcManager.requestTechnology(NfcTech.NfcA);

    // 1. Build the NDEF byte array
    const ndefMessage = buildMultiRecordNdef();

    // 2. Wrap in TLV
    const tlv = [0x03, ndefMessage.length, ...ndefMessage, 0xfe];

    // 3. Write TLV to pages (each page = 4 bytes)
    let page = 4; // Start writing at page 4
    for (let i = 0; i < tlv.length; i += 4) {
      const chunk = tlv.slice(i, i + 4);
      while (chunk.length < 4) chunk.push(0x00); // pad if less than 4 bytes
      const cmd = [0xa2, page, ...chunk];
      await NfcManager.nfcAHandler.transceive(cmd);
      console.log(`✅ Wrote page ${page}:`, cmd);
      page++;
    }

    console.log('🎉 Multiple records written successfully!');
    writeStatus = true;
  } catch (e) {
    console.warn('❌ Error writing multiple records:', e);
    writeStatus = false;
  } finally {
    // await NfcManager.cancelTechnologyRequest();
    return writeStatus;
  }
}

export function convertErrorMessage(msg) {
  if (msg.includes('Email already exists')) {
    return 'Email đã tồn tại. Vui lòng nhập email khác !';
  }
  return msg;
}
