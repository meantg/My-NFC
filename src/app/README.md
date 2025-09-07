# Redux Toolkit Structure

This project now follows the recommended Redux Toolkit structure as shown in the official documentation.

## Directory Structure

```
src/
├── app/
│   ├── store.js          # Main Redux store configuration
│   └── README.md         # This file
├── features/
│   └── counter/          # Example feature
│       ├── Counter.js    # React component
│       ├── counterSlice.js # Redux slice
│       └── counterAPI.js # API functions
└── store/                # Legacy store (can be migrated gradually)
    ├── api/              # RTK Query API slices
    ├── slices/           # Redux slices
    └── hooks/            # Custom hooks
```

## Key Changes

1. **Store Location**: Moved from `src/store/index.js` to `src/app/store.js`
2. **Feature-based Organization**: New features should be created in `src/features/`
3. **Provider Setup**: Updated import path in `src/stack/root.js`

## Usage

### Creating a New Feature

1. Create a new directory in `src/features/`
2. Add your slice, component, and API files
3. Import and add the reducer to `src/app/store.js`

### Example

```javascript
// src/features/myFeature/myFeatureSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const myFeatureSlice = createSlice({
  name: 'myFeature',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
  },
});

export const { increment } = myFeatureSlice.actions;
export default myFeatureSlice.reducer;
```

Then add to store:

```javascript
// src/app/store.js
import myFeatureReducer from '../features/myFeature/myFeatureSlice';

export const store = configureStore({
  reducer: {
    // ... other reducers
    myFeature: myFeatureReducer,
  },
});
```

## Migration Notes

- Existing slices in `src/store/slices/` continue to work
- API slices in `src/store/api/` remain unchanged
- Gradually migrate features to the new structure as needed 