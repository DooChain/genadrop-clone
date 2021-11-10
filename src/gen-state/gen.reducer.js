import genActionTypes from './gen.types';
import { addLayer, removeLayer, addImage, removeImage, addPreview, removePreview, updateImage, updatePreview } from './gen.utils';

export const INITIAL_STATE = {
  layers: [],
  preview: [],
  mintAmount: "",
  nftLayers: [],
  combinations: 0,
  isLoading: false,
  mintInfo: ""
}

export const genReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case genActionTypes.ORDER_LAYERS:
      return {
        ...state,
        layers: action.payload
      }
    case genActionTypes.ADD_LAYER:
      return {
        ...state,
        layers: addLayer(state.layers, action.payload)
      }
    case genActionTypes.REMOVE_LAYER:
      return {
        ...state,
        layers: removeLayer(state.layers, action.payload)
      }
    case genActionTypes.ADD_IMAGE:
      return {
        ...state,
        layers: addImage(state.layers, action.payload)
      }
    case genActionTypes.REMOVE_IMAGE:
      return {
        ...state,
        layers: removeImage(state.layers, action.payload)
      }

    case genActionTypes.UPDATE_IMAGE:
      return {
        ...state,
        layers: updateImage(state.layers, action.payload)
      }

    case genActionTypes.ADD_PREVIEW:
      return {
        ...state,
        preview: addPreview(state.preview, action.payload)
      }
    case genActionTypes.REMOVE_PREVIEW:
      return {
        ...state,
        preview: removePreview(state.preview, action.payload)
      }
    case genActionTypes.UPDATE_PREVIEW:
      return {
        ...state,
        preview: updatePreview(state.preview, action.payload)
      }
    case genActionTypes.SET_MINT_AMOUNT:
      return {
        ...state,
        mintAmount: action.payload
      }
    case genActionTypes.SET_NFT_LAYERS:
      return {
        ...state,
        nftLayers: action.payload
      }
    case genActionTypes.SET_COMBINATIONS:
      return {
        ...state,
        combinations: action.payload
      }
    case genActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }
    case genActionTypes.SET_MINT_INFO:
      return {
        ...state,
        mintInfo: action.payload
      }
    default:
      return state;
  }
}