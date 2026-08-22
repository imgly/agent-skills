# EngineErrorCode

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/EngineErrorCode`

Every stable catalog error code as a typed enum (raw value is the catalog id string). Branch on an `EngineError.code` by converting it into an `EngineErrorCode` with `EngineErrorCode(rawValue:)`:

```swift
enum EngineErrorCode
```

## Members

### EngineErrorCode.assetCannotApplyColorNoTarget

```swift
case assetCannotApplyColorNoTarget
```

### EngineErrorCode.assetColorCmykMissingFields

```swift
case assetColorCmykMissingFields
```

### EngineErrorCode.assetColorMissing

```swift
case assetColorMissing
```

### EngineErrorCode.assetColorMissingColorSpace

```swift
case assetColorMissingColorSpace
```

### EngineErrorCode.assetColorSpaceUnknown

```swift
case assetColorSpaceUnknown
```

### EngineErrorCode.assetColorSpotMissingFields

```swift
case assetColorSpotMissingFields
```

### EngineErrorCode.assetColorSpotRepresentationInvalid

```swift
case assetColorSpotRepresentationInvalid
```

### EngineErrorCode.assetColorSrgbMissingFields

```swift
case assetColorSrgbMissingFields
```

### EngineErrorCode.assetDocumentSourceNoAdd

```swift
case assetDocumentSourceNoAdd
```

### EngineErrorCode.assetDocumentSourceNoRemove

```swift
case assetDocumentSourceNoRemove
```

### EngineErrorCode.assetFacetPathNotFacetable

```swift
case assetFacetPathNotFacetable
```

### EngineErrorCode.assetFilterCombinatorEmpty

```swift
case assetFilterCombinatorEmpty
```

### EngineErrorCode.assetFilterCombinatorNotArray

```swift
case assetFilterCombinatorNotArray
```

### EngineErrorCode.assetFilterMetaKeyMissing

```swift
case assetFilterMetaKeyMissing
```

### EngineErrorCode.assetFilterMultipleDiscriminators

```swift
case assetFilterMultipleDiscriminators
```

### EngineErrorCode.assetFilterNoDiscriminator

```swift
case assetFilterNoDiscriminator
```

### EngineErrorCode.assetFilterNotChildNotObject

```swift
case assetFilterNotChildNotObject
```

### EngineErrorCode.assetFilterNotObject

```swift
case assetFilterNotObject
```

### EngineErrorCode.assetFilterOperandMissing

```swift
case assetFilterOperandMissing
```

### EngineErrorCode.assetFilterOperandNotString

```swift
case assetFilterOperandNotString
```

### EngineErrorCode.assetFilterPropertyEmpty

```swift
case assetFilterPropertyEmpty
```

### EngineErrorCode.assetFilterPropertyNotString

```swift
case assetFilterPropertyNotString
```

### EngineErrorCode.assetFilterPropertyUnknown

```swift
case assetFilterPropertyUnknown
```

### EngineErrorCode.assetFilterRootNotArray

```swift
case assetFilterRootNotArray
```

### EngineErrorCode.assetFilterUnrecognizedDiscriminator

```swift
case assetFilterUnrecognizedDiscriminator
```

### EngineErrorCode.assetFindFnRequired

```swift
case assetFindFnRequired
```

### EngineErrorCode.assetFontMissingName

```swift
case assetFontMissingName
```

### EngineErrorCode.assetFontMissingUrl

```swift
case assetFontMissingUrl
```

### EngineErrorCode.assetIdAlreadyExists

```swift
case assetIdAlreadyExists
```

### EngineErrorCode.assetJsonInvalidInUri

```swift
case assetJsonInvalidInUri
```

### EngineErrorCode.assetJsonMalformedLocal

```swift
case assetJsonMalformedLocal
```

### EngineErrorCode.assetMetaNonStringEntry

```swift
case assetMetaNonStringEntry
```

### EngineErrorCode.assetNoSelection

```swift
case assetNoSelection
```

### EngineErrorCode.assetResourceDataNotAvailable

```swift
case assetResourceDataNotAvailable
```

### EngineErrorCode.assetResourceDataUnavailable

```swift
case assetResourceDataUnavailable
```

### EngineErrorCode.assetResourceNotFoundAtUri

```swift
case assetResourceNotFoundAtUri
```

### EngineErrorCode.assetResourceNotReady

```swift
case assetResourceNotReady
```

### EngineErrorCode.assetResourceNotReadyAtUri

```swift
case assetResourceNotReadyAtUri
```

### EngineErrorCode.assetSortKeyMissing

```swift
case assetSortKeyMissing
```

### EngineErrorCode.assetSourceAddDenied

```swift
case assetSourceAddDenied
```

### EngineErrorCode.assetSourceAlreadyExists

```swift
case assetSourceAlreadyExists
```

### EngineErrorCode.assetSourceCannotAddAssets

```swift
case assetSourceCannotAddAssets
```

### EngineErrorCode.assetSourceCannotRemoveAssets

```swift
case assetSourceCannotRemoveAssets
```

### EngineErrorCode.assetSourceDoesNotSupportApplyProperties

```swift
case assetSourceDoesNotSupportApplyProperties
```

### EngineErrorCode.assetSourceNoPropertyMod

```swift
case assetSourceNoPropertyMod
```

### EngineErrorCode.assetSourceNotExists

```swift
case assetSourceNotExists
```

### EngineErrorCode.assetSourceNotRemovable

```swift
case assetSourceNotRemovable
```

### EngineErrorCode.assetSourceRemoveDenied

```swift
case assetSourceRemoveDenied
```

### EngineErrorCode.assetSourceUnknown

```swift
case assetSourceUnknown
```

### EngineErrorCode.assetStylePresetInvalidPayload

```swift
case assetStylePresetInvalidPayload
```

### EngineErrorCode.assetStylePresetMissingBlockType

```swift
case assetStylePresetMissingBlockType
```

### EngineErrorCode.assetStylePresetNotApplicable

```swift
case assetStylePresetNotApplicable
```

### EngineErrorCode.assetTargetBlockNotValid

```swift
case assetTargetBlockNotValid
```

### EngineErrorCode.assetTransformPresetFixedAspectMissingFields

```swift
case assetTransformPresetFixedAspectMissingFields
```

### EngineErrorCode.assetTransformPresetFixedSizeMissingFields

```swift
case assetTransformPresetFixedSizeMissingFields
```

### EngineErrorCode.assetTransformPresetMissingType

```swift
case assetTransformPresetMissingType
```

### EngineErrorCode.assetTransformPresetTypeUnknown

```swift
case assetTransformPresetTypeUnknown
```

### EngineErrorCode.assetTypefaceMissingFamily

```swift
case assetTypefaceMissingFamily
```

### EngineErrorCode.assetTypefaceMissingWeight

```swift
case assetTypefaceMissingWeight
```

### EngineErrorCode.assetUnsupportedMimeType

```swift
case assetUnsupportedMimeType
```

### EngineErrorCode.assetUnsupportedMimeTypeForBlock

```swift
case assetUnsupportedMimeTypeForBlock
```

### EngineErrorCode.assetUriInvalidBare

```swift
case assetUriInvalidBare
```

### EngineErrorCode.assetUriMetaMissing

```swift
case assetUriMetaMissing
```

### EngineErrorCode.audioDataSourceInitFailed

```swift
case audioDataSourceInitFailed
```

### EngineErrorCode.audioDataSourceNodeInitFailed

```swift
case audioDataSourceNodeInitFailed
```

### EngineErrorCode.audioDataSourceNoDuration

```swift
case audioDataSourceNoDuration
```

### EngineErrorCode.audioDecoderFormatFailed

```swift
case audioDecoderFormatFailed
```

### EngineErrorCode.audioDecoderInitFailed

```swift
case audioDecoderInitFailed
```

### EngineErrorCode.audioDeviceInitFailed

```swift
case audioDeviceInitFailed
```

### EngineErrorCode.audioDeviceResumeFailed

```swift
case audioDeviceResumeFailed
```

### EngineErrorCode.audioDeviceStartFailed

```swift
case audioDeviceStartFailed
```

### EngineErrorCode.audioDeviceStopFailed

```swift
case audioDeviceStopFailed
```

### EngineErrorCode.audioInvalidSoundHandle

```swift
case audioInvalidSoundHandle
```

### EngineErrorCode.audioNodeAttachOutputBusFailed

```swift
case audioNodeAttachOutputBusFailed
```

### EngineErrorCode.audioNodeGraphInitFailed

```swift
case audioNodeGraphInitFailed
```

### EngineErrorCode.audioNodeSetStateFailed

```swift
case audioNodeSetStateFailed
```

### EngineErrorCode.audioNodeStateChangeFailed

```swift
case audioNodeStateChangeFailed
```

### EngineErrorCode.audioPcmReadFailed

```swift
case audioPcmReadFailed
```

### EngineErrorCode.audioResamplerInitFailed

```swift
case audioResamplerInitFailed
```

### EngineErrorCode.audioUnsupportedCodec

```swift
case audioUnsupportedCodec
```

### EngineErrorCode.bindingAssetPlatformSourceUnavailable

```swift
case bindingAssetPlatformSourceUnavailable
```

### EngineErrorCode.bindingAssetSourceAddUnsupported

```swift
case bindingAssetSourceAddUnsupported
```

### EngineErrorCode.bindingAssetSourceApplyPropertiesUnsupported

```swift
case bindingAssetSourceApplyPropertiesUnsupported
```

### EngineErrorCode.bindingAssetSourceFetchUnsupported

```swift
case bindingAssetSourceFetchUnsupported
```

### EngineErrorCode.bindingAssetSourceRemoveUnsupported

```swift
case bindingAssetSourceRemoveUnsupported
```

### EngineErrorCode.bindingFacetCountNotNumber

```swift
case bindingFacetCountNotNumber
```

### EngineErrorCode.bindingFacetEntryNotObject

```swift
case bindingFacetEntryNotObject
```

### EngineErrorCode.bindingFacetNotArray

```swift
case bindingFacetNotArray
```

### EngineErrorCode.bindingFacetsQueryEntryNotString

```swift
case bindingFacetsQueryEntryNotString
```

### EngineErrorCode.bindingFacetsQueryNotArray

```swift
case bindingFacetsQueryNotArray
```

### EngineErrorCode.bindingFacetsResultNotObject

```swift
case bindingFacetsResultNotObject
```

### EngineErrorCode.bindingFacetValueMissing

```swift
case bindingFacetValueMissing
```

### EngineErrorCode.bindingHostCallbackThrew

```swift
case bindingHostCallbackThrew
```

### EngineErrorCode.bindingJsonNotRepresentable

```swift
case bindingJsonNotRepresentable
```

### EngineErrorCode.bindingJsonParseFailed

```swift
case bindingJsonParseFailed
```

### EngineErrorCode.bindingNodeNotInitialized

```swift
case bindingNodeNotInitialized
```

### EngineErrorCode.bindingNoTextBlockBeingEdited

```swift
case bindingNoTextBlockBeingEdited
```

### EngineErrorCode.bindingUriResolverInvalidResult

```swift
case bindingUriResolverInvalidResult
```

### EngineErrorCode.bindingUriResolverPromiseRejected

```swift
case bindingUriResolverPromiseRejected
```

### EngineErrorCode.bindingUriResolverUnavailable

```swift
case bindingUriResolverUnavailable
```

### EngineErrorCode.bindingWasmAssetFilterJsonParseFailed

```swift
case bindingWasmAssetFilterJsonParseFailed
```

### EngineErrorCode.bindingWasmAssetGroupsNotArray

```swift
case bindingWasmAssetGroupsNotArray
```

### EngineErrorCode.bindingWasmAssetMissingId

```swift
case bindingWasmAssetMissingId
```

### EngineErrorCode.bindingWasmAssetPropertyMissingDefaultValue

```swift
case bindingWasmAssetPropertyMissingDefaultValue
```

### EngineErrorCode.bindingWasmAssetPropertyMissingMax

```swift
case bindingWasmAssetPropertyMissingMax
```

### EngineErrorCode.bindingWasmAssetPropertyMissingMin

```swift
case bindingWasmAssetPropertyMissingMin
```

### EngineErrorCode.bindingWasmAssetPropertyMissingOptions

```swift
case bindingWasmAssetPropertyMissingOptions
```

### EngineErrorCode.bindingWasmAssetPropertyMissingStep

```swift
case bindingWasmAssetPropertyMissingStep
```

### EngineErrorCode.bindingWasmAssetPropertyMissingType

```swift
case bindingWasmAssetPropertyMissingType
```

### EngineErrorCode.bindingWasmAssetPropertyMissingValue

```swift
case bindingWasmAssetPropertyMissingValue
```

### EngineErrorCode.bindingWasmAssetPropertyUnknownType

```swift
case bindingWasmAssetPropertyUnknownType
```

### EngineErrorCode.bindingWasmAssetResultMissingId

```swift
case bindingWasmAssetResultMissingId
```

### EngineErrorCode.bindingWasmAssetResultMissingSourceId

```swift
case bindingWasmAssetResultMissingSourceId
```

### EngineErrorCode.bindingWasmBlockStateMissingError

```swift
case bindingWasmBlockStateMissingError
```

### EngineErrorCode.bindingWasmBlockStateMissingProgress

```swift
case bindingWasmBlockStateMissingProgress
```

### EngineErrorCode.bindingWasmBlockStateMissingType

```swift
case bindingWasmBlockStateMissingType
```

### EngineErrorCode.bindingWasmBlockStateUnhandled

```swift
case bindingWasmBlockStateUnhandled
```

### EngineErrorCode.bindingWasmBlockStateUnknownError

```swift
case bindingWasmBlockStateUnknownError
```

### EngineErrorCode.bindingWasmBlockStateUnknownType

```swift
case bindingWasmBlockStateUnknownType
```

### EngineErrorCode.bindingWasmColorMissingColorSpace

```swift
case bindingWasmColorMissingColorSpace
```

### EngineErrorCode.bindingWasmColorMissingComponents

```swift
case bindingWasmColorMissingComponents
```

### EngineErrorCode.bindingWasmColorMissingExternalReference

```swift
case bindingWasmColorMissingExternalReference
```

### EngineErrorCode.bindingWasmColorMissingSpotName

```swift
case bindingWasmColorMissingSpotName
```

### EngineErrorCode.bindingWasmColorMissingTint

```swift
case bindingWasmColorMissingTint
```

### EngineErrorCode.bindingWasmColorParseFailed

```swift
case bindingWasmColorParseFailed
```

### EngineErrorCode.bindingWasmCommandArgMapFailed

```swift
case bindingWasmCommandArgMapFailed
```

### EngineErrorCode.bindingWasmCommandSingleArgMismatch

```swift
case bindingWasmCommandSingleArgMismatch
```

### EngineErrorCode.bindingWasmFindResultMissingAssets

```swift
case bindingWasmFindResultMissingAssets
```

### EngineErrorCode.bindingWasmFindResultMissingCurrentPage

```swift
case bindingWasmFindResultMissingCurrentPage
```

### EngineErrorCode.bindingWasmFindResultMissingTotal

```swift
case bindingWasmFindResultMissingTotal
```

### EngineErrorCode.bindingWasmFontMissingSubfamily

```swift
case bindingWasmFontMissingSubfamily
```

### EngineErrorCode.bindingWasmFontMissingUri

```swift
case bindingWasmFontMissingUri
```

### EngineErrorCode.bindingWasmGradientStopMissingStopValue

```swift
case bindingWasmGradientStopMissingStopValue
```

### EngineErrorCode.bindingWasmMemAllocFailedBuffer

```swift
case bindingWasmMemAllocFailedBuffer
```

### EngineErrorCode.bindingWasmMemAllocFailedHandle

```swift
case bindingWasmMemAllocFailedHandle
```

### EngineErrorCode.bindingWasmPayloadColorCmykMissingFields

```swift
case bindingWasmPayloadColorCmykMissingFields
```

### EngineErrorCode.bindingWasmPayloadColorMissingColorSpace

```swift
case bindingWasmPayloadColorMissingColorSpace
```

### EngineErrorCode.bindingWasmPayloadColorSpotMissingFields

```swift
case bindingWasmPayloadColorSpotMissingFields
```

### EngineErrorCode.bindingWasmPayloadColorSpotRepresentationInvalid

```swift
case bindingWasmPayloadColorSpotRepresentationInvalid
```

### EngineErrorCode.bindingWasmPayloadColorSrgbMissingFields

```swift
case bindingWasmPayloadColorSrgbMissingFields
```

### EngineErrorCode.bindingWasmPropertiesNotArray

```swift
case bindingWasmPropertiesNotArray
```

### EngineErrorCode.bindingWasmSourceSetNotArray

```swift
case bindingWasmSourceSetNotArray
```

### EngineErrorCode.bindingWasmTransformPresetFixedAspectMissingFields

```swift
case bindingWasmTransformPresetFixedAspectMissingFields
```

### EngineErrorCode.bindingWasmTransformPresetFixedSizeMissingFields

```swift
case bindingWasmTransformPresetFixedSizeMissingFields
```

### EngineErrorCode.bindingWasmTransformPresetMissingType

```swift
case bindingWasmTransformPresetMissingType
```

### EngineErrorCode.bindingWasmTransformPresetUnknownType

```swift
case bindingWasmTransformPresetUnknownType
```

### EngineErrorCode.bindingWasmTypefaceMissingFonts

```swift
case bindingWasmTypefaceMissingFonts
```

### EngineErrorCode.bindingWasmTypefaceMissingName

```swift
case bindingWasmTypefaceMissingName
```

### EngineErrorCode.bindingWasmUnknownAudioOutputType

```swift
case bindingWasmUnknownAudioOutputType
```

### EngineErrorCode.bindingWasmUnknownColorSpace

```swift
case bindingWasmUnknownColorSpace
```

### EngineErrorCode.bindingWasmUnknownCutoutOperation

```swift
case bindingWasmUnknownCutoutOperation
```

### EngineErrorCode.bindingWasmUnknownCutoutType

```swift
case bindingWasmUnknownCutoutType
```

### EngineErrorCode.bindingWasmUnknownHorizontalAlignment

```swift
case bindingWasmUnknownHorizontalAlignment
```

### EngineErrorCode.bindingWasmUnknownScopeState

```swift
case bindingWasmUnknownScopeState
```

### EngineErrorCode.bindingWasmUnknownVerticalAlignment

```swift
case bindingWasmUnknownVerticalAlignment
```

### EngineErrorCode.blockAlwaysOnBottomUnsupported

```swift
case blockAlwaysOnBottomUnsupported
```

### EngineErrorCode.blockAlwaysOnTopUnsupported

```swift
case blockAlwaysOnTopUnsupported
```

### EngineErrorCode.blockAnimationAssetMalformedModeKey

```swift
case blockAnimationAssetMalformedModeKey
```

### EngineErrorCode.blockAnimationAssetMalformedTypeKey

```swift
case blockAnimationAssetMalformedTypeKey
```

### EngineErrorCode.blockAnimationAssetMissingMode

```swift
case blockAnimationAssetMissingMode
```

### EngineErrorCode.blockAnimationAssetMissingType

```swift
case blockAnimationAssetMissingType
```

### EngineErrorCode.blockAnimationNoAnimationsOnBlock

```swift
case blockAnimationNoAnimationsOnBlock
```

### EngineErrorCode.blockAnimationNoAnimationToEdit

```swift
case blockAnimationNoAnimationToEdit
```

### EngineErrorCode.blockAnimationNoEasingProperty

```swift
case blockAnimationNoEasingProperty
```

### EngineErrorCode.blockAnimationNoEasingPropertyOnBlock

```swift
case blockAnimationNoEasingPropertyOnBlock
```

### EngineErrorCode.blockAnimationNoOverlapProperty

```swift
case blockAnimationNoOverlapProperty
```

### EngineErrorCode.blockAnimationNotAPanAnimation

```swift
case blockAnimationNotAPanAnimation
```

### EngineErrorCode.blockAnimationNotASlideAnimation

```swift
case blockAnimationNotASlideAnimation
```

### EngineErrorCode.blockAnimationNoTextWritingStyle

```swift
case blockAnimationNoTextWritingStyle
```

### EngineErrorCode.blockAnimationNotInType

```swift
case blockAnimationNotInType
```

### EngineErrorCode.blockAnimationNotLoopType

```swift
case blockAnimationNotLoopType
```

### EngineErrorCode.blockAnimationNotOutType

```swift
case blockAnimationNotOutType
```

### EngineErrorCode.blockAnimationNoWritingStyleProperty

```swift
case blockAnimationNoWritingStyleProperty
```

### EngineErrorCode.blockAnimationTextOnly

```swift
case blockAnimationTextOnly
```

### EngineErrorCode.blockAnimationTypeNotRegistered

```swift
case blockAnimationTypeNotRegistered
```

### EngineErrorCode.blockAnimationUnknownEasing

```swift
case blockAnimationUnknownEasing
```

### EngineErrorCode.blockAnimationUnknownEnum

```swift
case blockAnimationUnknownEnum
```

### EngineErrorCode.blockAnimationUnknownMode

```swift
case blockAnimationUnknownMode
```

### EngineErrorCode.blockAnimationUnknownModeInAsset

```swift
case blockAnimationUnknownModeInAsset
```

### EngineErrorCode.blockAnimationUnknownPropertyType

```swift
case blockAnimationUnknownPropertyType
```

### EngineErrorCode.blockAnimationUnknownType

```swift
case blockAnimationUnknownType
```

### EngineErrorCode.blockAnimationUnsupported

```swift
case blockAnimationUnsupported
```

### EngineErrorCode.blockAssetSourceSortKeyMissing

```swift
case blockAssetSourceSortKeyMissing
```

### EngineErrorCode.blockAudioTrackIndexOutOfBounds

```swift
case blockAudioTrackIndexOutOfBounds
```

### EngineErrorCode.blockAutoToFreeLayoutUnsupported

```swift
case blockAutoToFreeLayoutUnsupported
```

### EngineErrorCode.blockBackgroundColorUnsupported

```swift
case blockBackgroundColorUnsupported
```

### EngineErrorCode.blockBlendModeUnsupported

```swift
case blockBlendModeUnsupported
```

### EngineErrorCode.blockBlocksNotCombinable

```swift
case blockBlocksNotCombinable
```

### EngineErrorCode.blockBlurUnknownType

```swift
case blockBlurUnknownType
```

### EngineErrorCode.blockBlurUnsupported

```swift
case blockBlurUnsupported
```

### EngineErrorCode.blockBufferLengthOutOfRange

```swift
case blockBufferLengthOutOfRange
```

### EngineErrorCode.blockBufferNotFound

```swift
case blockBufferNotFound
```

### EngineErrorCode.blockBufferOffsetOutOfRange

```swift
case blockBufferOffsetOutOfRange
```

### EngineErrorCode.blockBufferUriInvalid

```swift
case blockBufferUriInvalid
```

### EngineErrorCode.blockCameraDestructionNotAllowed

```swift
case blockCameraDestructionNotAllowed
```

### EngineErrorCode.blockCameraTransformLock

```swift
case blockCameraTransformLock
```

### EngineErrorCode.blockCaptionsDisabled

```swift
case blockCaptionsDisabled
```

### EngineErrorCode.blockCaptionTracksDisabled

```swift
case blockCaptionTracksDisabled
```

### EngineErrorCode.blockChildrenIndexOutOfBounds

```swift
case blockChildrenIndexOutOfBounds
```

### EngineErrorCode.blockColorComponentOutOfRange

```swift
case blockColorComponentOutOfRange
```

### EngineErrorCode.blockColorNotInColorSpace

```swift
case blockColorNotInColorSpace
```

### EngineErrorCode.blockColorSpaceConversionNotSupported

```swift
case blockColorSpaceConversionNotSupported
```

### EngineErrorCode.blockColorTintOutOfRange

```swift
case blockColorTintOutOfRange
```

### EngineErrorCode.blockCombineTextFontLoading

```swift
case blockCombineTextFontLoading
```

### EngineErrorCode.blockComponentNoProperty

```swift
case blockComponentNoProperty
```

### EngineErrorCode.blockComponentNotRegistered

```swift
case blockComponentNotRegistered
```

### EngineErrorCode.blockContentAspectImageNoDimensions

```swift
case blockContentAspectImageNoDimensions
```

### EngineErrorCode.blockContentAspectNoFill

```swift
case blockContentAspectNoFill
```

### EngineErrorCode.blockContentAspectNotImageOrVideo

```swift
case blockContentAspectNotImageOrVideo
```

### EngineErrorCode.blockContentAspectVideoNoDimensions

```swift
case blockContentAspectVideoNoDimensions
```

### EngineErrorCode.blockContentFillAlignmentUnsupported

```swift
case blockContentFillAlignmentUnsupported
```

### EngineErrorCode.blockContentFillModeUnsupported

```swift
case blockContentFillModeUnsupported
```

### EngineErrorCode.blockCreationNotAllowed

```swift
case blockCreationNotAllowed
```

### EngineErrorCode.blockCutoutNoBlockSelected

```swift
case blockCutoutNoBlockSelected
```

### EngineErrorCode.blockCutoutPathRequired

```swift
case blockCutoutPathRequired
```

### EngineErrorCode.blockDifferenceNoEffect

```swift
case blockDifferenceNoEffect
```

### EngineErrorCode.blockDropShadowsUnsupported

```swift
case blockDropShadowsUnsupported
```

### EngineErrorCode.blockEffectIndexOutOfBounds

```swift
case blockEffectIndexOutOfBounds
```

### EngineErrorCode.blockEffectNotAnEffect

```swift
case blockEffectNotAnEffect
```

### EngineErrorCode.blockEffectsUnsupported

```swift
case blockEffectsUnsupported
```

### EngineErrorCode.blockEffectUnknownType

```swift
case blockEffectUnknownType
```

### EngineErrorCode.blockElementsNotAlignable

```swift
case blockElementsNotAlignable
```

### EngineErrorCode.blockElementsNotDistributable

```swift
case blockElementsNotDistributable
```

### EngineErrorCode.blockElementsNotGroupable

```swift
case blockElementsNotGroupable
```

### EngineErrorCode.blockEntityNotLaidOut

```swift
case blockEntityNotLaidOut
```

### EngineErrorCode.blockEnumValueInvalid

```swift
case blockEnumValueInvalid
```

### EngineErrorCode.blockExportableUnsupported

```swift
case blockExportableUnsupported
```

### EngineErrorCode.blockFillGetSolidColorWrongType

```swift
case blockFillGetSolidColorWrongType
```

### EngineErrorCode.blockFillMissing

```swift
case blockFillMissing
```

### EngineErrorCode.blockFillNoSolidColor

```swift
case blockFillNoSolidColor
```

### EngineErrorCode.blockFillNoSolidColorFill

```swift
case blockFillNoSolidColorFill
```

### EngineErrorCode.blockFillNotValid

```swift
case blockFillNotValid
```

### EngineErrorCode.blockFillSetSolidColorWrongType

```swift
case blockFillSetSolidColorWrongType
```

### EngineErrorCode.blockFillTextSolidColorOnly

```swift
case blockFillTextSolidColorOnly
```

### EngineErrorCode.blockFillUnsupported

```swift
case blockFillUnsupported
```

### EngineErrorCode.blockGradientColorStopsDuplicate

```swift
case blockGradientColorStopsDuplicate
```

### EngineErrorCode.blockGradientColorStopsNotSorted

```swift
case blockGradientColorStopsNotSorted
```

### EngineErrorCode.blockGradientColorStopsOutOfRange

```swift
case blockGradientColorStopsOutOfRange
```

### EngineErrorCode.blockGradientColorUnsupported

```swift
case blockGradientColorUnsupported
```

### EngineErrorCode.blockGroupAbsoluteOnly

```swift
case blockGroupAbsoluteOnly
```

### EngineErrorCode.blockHeightInvalidForScaling

```swift
case blockHeightInvalidForScaling
```

### EngineErrorCode.blockHistoryHandleInvalidAt

```swift
case blockHistoryHandleInvalidAt
```

### EngineErrorCode.blockIdInvalid

```swift
case blockIdInvalid
```

### EngineErrorCode.blockImageFillUnsupported

```swift
case blockImageFillUnsupported
```

### EngineErrorCode.blockImageLoadFailed

```swift
case blockImageLoadFailed
```

### EngineErrorCode.blockKeyNotFound

```swift
case blockKeyNotFound
```

### EngineErrorCode.blockMissingRequestedComponent

```swift
case blockMissingRequestedComponent
```

### EngineErrorCode.blockNameUnsupported

```swift
case blockNameUnsupported
```

### EngineErrorCode.blockNoAudioTracksFound

```swift
case blockNoAudioTracksFound
```

### EngineErrorCode.blockNoAudioTracksInVideo

```swift
case blockNoAudioTracksInVideo
```

### EngineErrorCode.blockNoBlockSelected

```swift
case blockNoBlockSelected
```

### EngineErrorCode.blockNoKind

```swift
case blockNoKind
```

### EngineErrorCode.blockNoParent

```swift
case blockNoParent
```

### EngineErrorCode.blockNoPosition

```swift
case blockNoPosition
```

### EngineErrorCode.blockNoShapeProperty

```swift
case blockNoShapeProperty
```

### EngineErrorCode.blockNoSize

```swift
case blockNoSize
```

### EngineErrorCode.blockNotACutoutBlock

```swift
case blockNotACutoutBlock
```

### EngineErrorCode.blockNotADesignBlock

```swift
case blockNotADesignBlock
```

### EngineErrorCode.blockNotATextBlock

```swift
case blockNotATextBlock
```

### EngineErrorCode.blockNotATextBlockSimple

```swift
case blockNotATextBlockSimple
```

### EngineErrorCode.blockNotAttachedToScene

```swift
case blockNotAttachedToScene
```

### EngineErrorCode.blockNotAVideoFillBlock

```swift
case blockNotAVideoFillBlock
```

### EngineErrorCode.blockNotKnownBlockType

```swift
case blockNotKnownBlockType
```

### EngineErrorCode.blockNotLaidOut

```swift
case blockNotLaidOut
```

### EngineErrorCode.blockNotLaidOutAabb

```swift
case blockNotLaidOutAabb
```

### EngineErrorCode.blockNotLaidOutBeforeAdjustCrop

```swift
case blockNotLaidOutBeforeAdjustCrop
```

### EngineErrorCode.blockNotLaidOutFlipH

```swift
case blockNotLaidOutFlipH
```

### EngineErrorCode.blockNotLaidOutFlipV

```swift
case blockNotLaidOutFlipV
```

### EngineErrorCode.blockNotLaidOutForScene

```swift
case blockNotLaidOutForScene
```

### EngineErrorCode.blockNotLaidOutRotation

```swift
case blockNotLaidOutRotation
```

### EngineErrorCode.blockNotLaidOutScale

```swift
case blockNotLaidOutScale
```

### EngineErrorCode.blockNotValid

```swift
case blockNotValid
```

### EngineErrorCode.blockOpacityUnsupported

```swift
case blockOpacityUnsupported
```

### EngineErrorCode.blockOperationPreconditionFailed

```swift
case blockOperationPreconditionFailed
```

### EngineErrorCode.blockOpNeedsTwoBlocks

```swift
case blockOpNeedsTwoBlocks
```

### EngineErrorCode.blockParentNotLaidOut

```swift
case blockParentNotLaidOut
```

### EngineErrorCode.blockPendingProgressInvalid

```swift
case blockPendingProgressInvalid
```

### EngineErrorCode.blockPositionLocked

```swift
case blockPositionLocked
```

### EngineErrorCode.blockPositionParentControlled

```swift
case blockPositionParentControlled
```

### EngineErrorCode.blockPropertyEnumCastFailed

```swift
case blockPropertyEnumCastFailed
```

### EngineErrorCode.blockPropertyEnumMemberCastFailed

```swift
case blockPropertyEnumMemberCastFailed
```

### EngineErrorCode.blockPropertyFontFileUriDirectUnsupported

```swift
case blockPropertyFontFileUriDirectUnsupported
```

### EngineErrorCode.blockPropertyGetterMismatch

```swift
case blockPropertyGetterMismatch
```

### EngineErrorCode.blockPropertyInvalidEnumValue

```swift
case blockPropertyInvalidEnumValue
```

### EngineErrorCode.blockPropertyInvalidEnumValueChoices

```swift
case blockPropertyInvalidEnumValueChoices
```

### EngineErrorCode.blockPropertyNotAnEnumeration

```swift
case blockPropertyNotAnEnumeration
```

### EngineErrorCode.blockPropertyNotEnum

```swift
case blockPropertyNotEnum
```

### EngineErrorCode.blockPropertyNotFound

```swift
case blockPropertyNotFound
```

### EngineErrorCode.blockPropertyNotFoundWithHint

```swift
case blockPropertyNotFoundWithHint
```

### EngineErrorCode.blockPropertyNotReadable

```swift
case blockPropertyNotReadable
```

### EngineErrorCode.blockPropertyNotWriteable

```swift
case blockPropertyNotWriteable
```

### EngineErrorCode.blockPropertySetterMismatch

```swift
case blockPropertySetterMismatch
```

### EngineErrorCode.blockResultEmptyShape

```swift
case blockResultEmptyShape
```

### EngineErrorCode.blockSceneCreateDifferent

```swift
case blockSceneCreateDifferent
```

### EngineErrorCode.blockScopeInvalid

```swift
case blockScopeInvalid
```

### EngineErrorCode.blockScopeMixedValues

```swift
case blockScopeMixedValues
```

### EngineErrorCode.blockScopePermissionDenied

```swift
case blockScopePermissionDenied
```

### EngineErrorCode.blockScopesUnsupported

```swift
case blockScopesUnsupported
```

### EngineErrorCode.blockSelectionDisabled

```swift
case blockSelectionDisabled
```

### EngineErrorCode.blockShadowXBlurInvalid

```swift
case blockShadowXBlurInvalid
```

### EngineErrorCode.blockShadowXOffsetInvalid

```swift
case blockShadowXOffsetInvalid
```

### EngineErrorCode.blockShadowYBlurInvalid

```swift
case blockShadowYBlurInvalid
```

### EngineErrorCode.blockShadowYOffsetInvalid

```swift
case blockShadowYOffsetInvalid
```

### EngineErrorCode.blockShapeNotValid

```swift
case blockShapeNotValid
```

### EngineErrorCode.blockSomeElementsNotLoaded

```swift
case blockSomeElementsNotLoaded
```

### EngineErrorCode.blockSourceSetEmpty

```swift
case blockSourceSetEmpty
```

### EngineErrorCode.blockStrokeDashArrayInvalid

```swift
case blockStrokeDashArrayInvalid
```

### EngineErrorCode.blockStrokeDashOffsetInvalid

```swift
case blockStrokeDashOffsetInvalid
```

### EngineErrorCode.blockStrokeMissing

```swift
case blockStrokeMissing
```

### EngineErrorCode.blockStrokesUnsupported

```swift
case blockStrokesUnsupported
```

### EngineErrorCode.blockStrokeWidthInvalid

```swift
case blockStrokeWidthInvalid
```

### EngineErrorCode.blockSvgPathParseFailed

```swift
case blockSvgPathParseFailed
```

### EngineErrorCode.blockTargetNotAnAnimation

```swift
case blockTargetNotAnAnimation
```

### EngineErrorCode.blockTargetNotAVideoFill

```swift
case blockTargetNotAVideoFill
```

### EngineErrorCode.blockTextCannotToggleBold

```swift
case blockTextCannotToggleBold
```

### EngineErrorCode.blockTextCannotToggleItalic

```swift
case blockTextCannotToggleItalic
```

### EngineErrorCode.blockTextInvalidFontSize

```swift
case blockTextInvalidFontSize
```

### EngineErrorCode.blockTextInvalidKerning

```swift
case blockTextInvalidKerning
```

### EngineErrorCode.blockTextInvalidLineIndex

```swift
case blockTextInvalidLineIndex
```

### EngineErrorCode.blockTextInvalidRangeForLine

```swift
case blockTextInvalidRangeForLine
```

### EngineErrorCode.blockTextLineBoundsFailed

```swift
case blockTextLineBoundsFailed
```

### EngineErrorCode.blockTextLineHeightInvalid

```swift
case blockTextLineHeightInvalid
```

### EngineErrorCode.blockTextListLevelNegative

```swift
case blockTextListLevelNegative
```

### EngineErrorCode.blockTextListLevelTooLarge

```swift
case blockTextListLevelTooLarge
```

### EngineErrorCode.blockTextNoBlockBeingEdited

```swift
case blockTextNoBlockBeingEdited
```

### EngineErrorCode.blockTextNoTypeface

```swift
case blockTextNoTypeface
```

### EngineErrorCode.blockTextNoTypefaceAndDefaultNotRegistered

```swift
case blockTextNoTypefaceAndDefaultNotRegistered
```

### EngineErrorCode.blockTextOnPathInvalidSvgPath

```swift
case blockTextOnPathInvalidSvgPath
```

### EngineErrorCode.blockTextOnPathMultipleSubpaths

```swift
case blockTextOnPathMultipleSubpaths
```

### EngineErrorCode.blockTextOnPathNoMeasurableContour

```swift
case blockTextOnPathNoMeasurableContour
```

### EngineErrorCode.blockTextParagraphIndexNegative

```swift
case blockTextParagraphIndexNegative
```

### EngineErrorCode.blockTextParagraphIndexOutOfRange

```swift
case blockTextParagraphIndexOutOfRange
```

### EngineErrorCode.blockTextRangeFromOutOfRange

```swift
case blockTextRangeFromOutOfRange
```

### EngineErrorCode.blockTextRangeInvalidOrder

```swift
case blockTextRangeInvalidOrder
```

### EngineErrorCode.blockTextRangeNegative

```swift
case blockTextRangeNegative
```

### EngineErrorCode.blockTextRangeToOutOfRange

```swift
case blockTextRangeToOutOfRange
```

### EngineErrorCode.blockTextTypefaceUpdateFailed

```swift
case blockTextTypefaceUpdateFailed
```

### EngineErrorCode.blockTextUnknownTypeface

```swift
case blockTextUnknownTypeface
```

### EngineErrorCode.blockTextUnsupportedFontStyle

```swift
case blockTextUnsupportedFontStyle
```

### EngineErrorCode.blockTextUnsupportedFontWeight

```swift
case blockTextUnsupportedFontWeight
```

### EngineErrorCode.blockThresholdNotFinite

```swift
case blockThresholdNotFinite
```

### EngineErrorCode.blockTransformLockedFillParent

```swift
case blockTransformLockedFillParent
```

### EngineErrorCode.blockTransformLockedFlip

```swift
case blockTransformLockedFlip
```

### EngineErrorCode.blockTransformLockedResize

```swift
case blockTransformLockedResize
```

### EngineErrorCode.blockTransformLockedRotate

```swift
case blockTransformLockedRotate
```

### EngineErrorCode.blockTransformLockedScale

```swift
case blockTransformLockedScale
```

### EngineErrorCode.blockTransitionBlockInvalid

```swift
case blockTransitionBlockInvalid
```

### EngineErrorCode.blockTransitionBlockNotATransition

```swift
case blockTransitionBlockNotATransition
```

### EngineErrorCode.blockTransitionTypeNotRegistered

```swift
case blockTransitionTypeNotRegistered
```

### EngineErrorCode.blockTypeCannotBeArranged

```swift
case blockTypeCannotBeArranged
```

### EngineErrorCode.blockTypeCannotBeClipped

```swift
case blockTypeCannotBeClipped
```

### EngineErrorCode.blockTypeCannotBeFlipped

```swift
case blockTypeCannotBeFlipped
```

### EngineErrorCode.blockTypeCannotBeLocked

```swift
case blockTypeCannotBeLocked
```

### EngineErrorCode.blockTypeCannotBePlaceholder

```swift
case blockTypeCannotBePlaceholder
```

### EngineErrorCode.blockTypeCannotBeSelected

```swift
case blockTypeCannotBeSelected
```

### EngineErrorCode.blockTypeCannotHaveRotation

```swift
case blockTypeCannotHaveRotation
```

### EngineErrorCode.blockTypeNoAddingChildren

```swift
case blockTypeNoAddingChildren
```

### EngineErrorCode.blockTypeNoChildren

```swift
case blockTypeNoChildren
```

### EngineErrorCode.blockTypeNoFrame

```swift
case blockTypeNoFrame
```

### EngineErrorCode.blockTypeNoGroups

```swift
case blockTypeNoGroups
```

### EngineErrorCode.blockTypeNoHighlighting

```swift
case blockTypeNoHighlighting
```

### EngineErrorCode.blockTypeNoParent

```swift
case blockTypeNoParent
```

### EngineErrorCode.blockTypeNoPlaceholderBehavior

```swift
case blockTypeNoPlaceholderBehavior
```

### EngineErrorCode.blockTypeNoPlaceholderControls

```swift
case blockTypeNoPlaceholderControls
```

### EngineErrorCode.blockTypeNoPosition

```swift
case blockTypeNoPosition
```

### EngineErrorCode.blockTypeNoRotation

```swift
case blockTypeNoRotation
```

### EngineErrorCode.blockTypeNoSize

```swift
case blockTypeNoSize
```

### EngineErrorCode.blockTypeNotAChild

```swift
case blockTypeNotAChild
```

### EngineErrorCode.blockTypeNoVisibilityState

```swift
case blockTypeNoVisibilityState
```

### EngineErrorCode.blockTypePermanentlyNonSelectable

```swift
case blockTypePermanentlyNonSelectable
```

### EngineErrorCode.blockUnionNoEffect

```swift
case blockUnionNoEffect
```

### EngineErrorCode.blockUnknown

```swift
case blockUnknown
```

### EngineErrorCode.blockUnknownBlockType

```swift
case blockUnknownBlockType
```

### EngineErrorCode.blockUnknownFillType

```swift
case blockUnknownFillType
```

### EngineErrorCode.blockUnknownShapeType

```swift
case blockUnknownShapeType
```

### EngineErrorCode.blockUuidUnsupported

```swift
case blockUuidUnsupported
```

### EngineErrorCode.blockValueNotFinite

```swift
case blockValueNotFinite
```

### EngineErrorCode.blockValueNotFiniteInUnitRange

```swift
case blockValueNotFiniteInUnitRange
```

### EngineErrorCode.blockValueNotNumber

```swift
case blockValueNotNumber
```

### EngineErrorCode.blockValuesNotFiniteThree

```swift
case blockValuesNotFiniteThree
```

### EngineErrorCode.blockValuesNotFiniteTwo

```swift
case blockValuesNotFiniteTwo
```

### EngineErrorCode.blockVariableNotFound

```swift
case blockVariableNotFound
```

### EngineErrorCode.blockVideoFillNoUri

```swift
case blockVideoFillNoUri
```

### EngineErrorCode.blockVideoLoadFailed

```swift
case blockVideoLoadFailed
```

### EngineErrorCode.blockVideoResourceNotLoaded

```swift
case blockVideoResourceNotLoaded
```

### EngineErrorCode.blockVideoResourceNotLoadedForOperation

```swift
case blockVideoResourceNotLoadedForOperation
```

### EngineErrorCode.blockWidthInvalidForScaling

```swift
case blockWidthInvalidForScaling
```

### EngineErrorCode.codecAndroidAudioEncoderCreateFailed

```swift
case codecAndroidAudioEncoderCreateFailed
```

### EngineErrorCode.codecAndroidJniError

```swift
case codecAndroidJniError
```

### EngineErrorCode.codecAppleOsstatusFailure

```swift
case codecAppleOsstatusFailure
```

### EngineErrorCode.codecAudioDecoderCreateFailed

```swift
case codecAudioDecoderCreateFailed
```

### EngineErrorCode.codecAudioDecoderFatal

```swift
case codecAudioDecoderFatal
```

### EngineErrorCode.codecAudioDecoderMetadataInvalid

```swift
case codecAudioDecoderMetadataInvalid
```

### EngineErrorCode.codecAudioDecoderNoChunks

```swift
case codecAudioDecoderNoChunks
```

### EngineErrorCode.codecAudioDecoderNoFrames

```swift
case codecAudioDecoderNoFrames
```

### EngineErrorCode.codecAudioDecoderZeroFramesPerChunk

```swift
case codecAudioDecoderZeroFramesPerChunk
```

### EngineErrorCode.codecAudioDecoderZeroFramesPerPacket

```swift
case codecAudioDecoderZeroFramesPerPacket
```

### EngineErrorCode.codecAudioDecodeUnsupported

```swift
case codecAudioDecodeUnsupported
```

### EngineErrorCode.codecAudioEncoderConfigInvalid

```swift
case codecAudioEncoderConfigInvalid
```

### EngineErrorCode.codecAudioEncoderCreateFailed

```swift
case codecAudioEncoderCreateFailed
```

### EngineErrorCode.codecAudioEncodeUnsupported

```swift
case codecAudioEncodeUnsupported
```

### EngineErrorCode.codecAudioTrackNotFound

```swift
case codecAudioTrackNotFound
```

### EngineErrorCode.codecBackendTextureIncomplete

```swift
case codecBackendTextureIncomplete
```

### EngineErrorCode.codecEmptyAudioCodecString

```swift
case codecEmptyAudioCodecString
```

### EngineErrorCode.codecEmptyVideoCodecString

```swift
case codecEmptyVideoCodecString
```

### EngineErrorCode.codecEncoderStateNotFound

```swift
case codecEncoderStateNotFound
```

### EngineErrorCode.codecGstreamerCreateElementFailed

```swift
case codecGstreamerCreateElementFailed
```

### EngineErrorCode.codecGstreamerCreateSinkCapsFailed

```swift
case codecGstreamerCreateSinkCapsFailed
```

### EngineErrorCode.codecGstreamerCreateSourceCapsFailed

```swift
case codecGstreamerCreateSourceCapsFailed
```

### EngineErrorCode.codecGstreamerLinkAudioEncoderFailed

```swift
case codecGstreamerLinkAudioEncoderFailed
```

### EngineErrorCode.codecGstreamerLinkAudioFailed

```swift
case codecGstreamerLinkAudioFailed
```

### EngineErrorCode.codecGstreamerLinkVideoEncoderFailed

```swift
case codecGstreamerLinkVideoEncoderFailed
```

### EngineErrorCode.codecGstreamerLinkVideoFailed

```swift
case codecGstreamerLinkVideoFailed
```

### EngineErrorCode.codecGstreamerPipelineCreateFailed

```swift
case codecGstreamerPipelineCreateFailed
```

### EngineErrorCode.codecGstreamerPipelineError

```swift
case codecGstreamerPipelineError
```

### EngineErrorCode.codecGstreamerUnexpectedMessage

```swift
case codecGstreamerUnexpectedMessage
```

### EngineErrorCode.codecMetalTextureFromIosurfaceFailed

```swift
case codecMetalTextureFromIosurfaceFailed
```

### EngineErrorCode.codecNoContext

```swift
case codecNoContext
```

### EngineErrorCode.codecNoGpuContext

```swift
case codecNoGpuContext
```

### EngineErrorCode.codecOffscreenCanvasCreateFailed

```swift
case codecOffscreenCanvasCreateFailed
```

### EngineErrorCode.codecOffscreenContextUnavailable

```swift
case codecOffscreenContextUnavailable
```

### EngineErrorCode.codecPixelBufferNoIosurface

```swift
case codecPixelBufferNoIosurface
```

### EngineErrorCode.codecPixelBufferPoolCreateFailed

```swift
case codecPixelBufferPoolCreateFailed
```

### EngineErrorCode.codecPresentationTimestampsNotUnique

```swift
case codecPresentationTimestampsNotUnique
```

### EngineErrorCode.codecRecordingContextUnavailable

```swift
case codecRecordingContextUnavailable
```

### EngineErrorCode.codecUnknownAudioDecoderHandle

```swift
case codecUnknownAudioDecoderHandle
```

### EngineErrorCode.codecUnknownCodecString

```swift
case codecUnknownCodecString
```

### EngineErrorCode.codecUnknownVideoDecoderHandle

```swift
case codecUnknownVideoDecoderHandle
```

### EngineErrorCode.codecUnknownVideoDecoderHandleNoArg

```swift
case codecUnknownVideoDecoderHandleNoArg
```

### EngineErrorCode.codecUnreachableForCodec

```swift
case codecUnreachableForCodec
```

### EngineErrorCode.codecUnsupportedCodecString

```swift
case codecUnsupportedCodecString
```

### EngineErrorCode.codecUnsupportedH265CodecString

```swift
case codecUnsupportedH265CodecString
```

### EngineErrorCode.codecVideoBitrateInvalid

```swift
case codecVideoBitrateInvalid
```

### EngineErrorCode.codecVideoDecoderCreateFailed

```swift
case codecVideoDecoderCreateFailed
```

### EngineErrorCode.codecVideoDecoderFatal

```swift
case codecVideoDecoderFatal
```

### EngineErrorCode.codecVideoDecoderUnresponsive

```swift
case codecVideoDecoderUnresponsive
```

### EngineErrorCode.codecVideoDecodeUnsupported

```swift
case codecVideoDecodeUnsupported
```

### EngineErrorCode.codecVideoEncoderBusy

```swift
case codecVideoEncoderBusy
```

### EngineErrorCode.codecVideoEncoderCreateFailed

```swift
case codecVideoEncoderCreateFailed
```

### EngineErrorCode.codecVideoEncoderInvalidResolution

```swift
case codecVideoEncoderInvalidResolution
```

### EngineErrorCode.codecVideoEncodeUnsupported

```swift
case codecVideoEncodeUnsupported
```

### EngineErrorCode.codecVideoSessionCreateFailed

```swift
case codecVideoSessionCreateFailed
```

### EngineErrorCode.codecVideoTrackNotFound

```swift
case codecVideoTrackNotFound
```

### EngineErrorCode.codecWebcodecsInvalidFormat

```swift
case codecWebcodecsInvalidFormat
```

### EngineErrorCode.codecWebcodecsNotAvailableNode

```swift
case codecWebcodecsNotAvailableNode
```

### EngineErrorCode.codecWebcodecsNotSupported

```swift
case codecWebcodecsNotSupported
```

### EngineErrorCode.computeColorSpaceBitDepthUnsupported

```swift
case computeColorSpaceBitDepthUnsupported
```

### EngineErrorCode.computeColorSpaceDisplayUnsupported

```swift
case computeColorSpaceDisplayUnsupported
```

### EngineErrorCode.computeColorSpaceUnsupportedByEngine

```swift
case computeColorSpaceUnsupportedByEngine
```

### EngineErrorCode.computeContextCreateFnNotFound

```swift
case computeContextCreateFnNotFound
```

### EngineErrorCode.computeDataProviderEmpty

```swift
case computeDataProviderEmpty
```

### EngineErrorCode.computeDataProviderNotContiguous

```swift
case computeDataProviderNotContiguous
```

### EngineErrorCode.computeDataProviderNotFullyAvailable

```swift
case computeDataProviderNotFullyAvailable
```

### EngineErrorCode.computeDataProviderTooLarge

```swift
case computeDataProviderTooLarge
```

### EngineErrorCode.computeEglCreateContextFailed

```swift
case computeEglCreateContextFailed
```

### EngineErrorCode.computeEglCreateSurfaceFailed

```swift
case computeEglCreateSurfaceFailed
```

### EngineErrorCode.computeEglInvalidContextType

```swift
case computeEglInvalidContextType
```

### EngineErrorCode.computeEglNoConfigsMatch

```swift
case computeEglNoConfigsMatch
```

### EngineErrorCode.computeEglNoDisplay

```swift
case computeEglNoDisplay
```

### EngineErrorCode.computeEglOperationFailed

```swift
case computeEglOperationFailed
```

### EngineErrorCode.computeEmscriptenMakeContextCurrentFailed

```swift
case computeEmscriptenMakeContextCurrentFailed
```

### EngineErrorCode.computeGrDirectContextCreateFailed

```swift
case computeGrDirectContextCreateFailed
```

### EngineErrorCode.computeHttpDataNoBuffer

```swift
case computeHttpDataNoBuffer
```

### EngineErrorCode.computeMp3ParseTrackDataFailed

```swift
case computeMp3ParseTrackDataFailed
```

### EngineErrorCode.computeMp3ParseTrackMetadataInvalid

```swift
case computeMp3ParseTrackMetadataInvalid
```

### EngineErrorCode.computeMp4DurationZero

```swift
case computeMp4DurationZero
```

### EngineErrorCode.computeMp4TimescaleZero

```swift
case computeMp4TimescaleZero
```

### EngineErrorCode.computeOpfsReadFailed

```swift
case computeOpfsReadFailed
```

### EngineErrorCode.computeSkiaGlInterfaceInvalid

```swift
case computeSkiaGlInterfaceInvalid
```

### EngineErrorCode.computeVideoUnsupportedAudioTracks

```swift
case computeVideoUnsupportedAudioTracks
```

### EngineErrorCode.editorAudioBufferInvalidSize

```swift
case editorAudioBufferInvalidSize
```

### EngineErrorCode.editorAudioBufferInvalidUri

```swift
case editorAudioBufferInvalidUri
```

### EngineErrorCode.editorAudioBufferNoData

```swift
case editorAudioBufferNoData
```

### EngineErrorCode.editorAudioDecodeFailed

```swift
case editorAudioDecodeFailed
```

### EngineErrorCode.editorAudioDecoderCreateFailed

```swift
case editorAudioDecoderCreateFailed
```

### EngineErrorCode.editorAudioFetchFailed

```swift
case editorAudioFetchFailed
```

### EngineErrorCode.editorAudioInvalidRange

```swift
case editorAudioInvalidRange
```

### EngineErrorCode.editorAudioNotLoaded

```swift
case editorAudioNotLoaded
```

### EngineErrorCode.editorAudioUnsupportedFormat

```swift
case editorAudioUnsupportedFormat
```

### EngineErrorCode.editorAvBlockInvalidWithHint

```swift
case editorAvBlockInvalidWithHint
```

### EngineErrorCode.editorAvDurationUndefined

```swift
case editorAvDurationUndefined
```

### EngineErrorCode.editorAvOperationAudioOrVideoFill

```swift
case editorAvOperationAudioOrVideoFill
```

### EngineErrorCode.editorAvOperationBlockTypeUnsupported

```swift
case editorAvOperationBlockTypeUnsupported
```

### EngineErrorCode.editorAvOperationVideoOnly

```swift
case editorAvOperationVideoOnly
```

### EngineErrorCode.editorBlockNoDuration

```swift
case editorBlockNoDuration
```

### EngineErrorCode.editorBlockNoDurationAsPageSource

```swift
case editorBlockNoDurationAsPageSource
```

### EngineErrorCode.editorBlockNoDurationSupport

```swift
case editorBlockNoDurationSupport
```

### EngineErrorCode.editorBlockNoPlaybackControlSupport

```swift
case editorBlockNoPlaybackControlSupport
```

### EngineErrorCode.editorBlockNoPlaybackSupport

```swift
case editorBlockNoPlaybackSupport
```

### EngineErrorCode.editorBlockNotAPage

```swift
case editorBlockNotAPage
```

### EngineErrorCode.editorBlockNotAttachedToPage

```swift
case editorBlockNotAttachedToPage
```

### EngineErrorCode.editorBlockNoTimeOffsetSupport

```swift
case editorBlockNoTimeOffsetSupport
```

### EngineErrorCode.editorBlockNoTrimSupport

```swift
case editorBlockNoTrimSupport
```

### EngineErrorCode.editorCameraClampAcrossScenes

```swift
case editorCameraClampAcrossScenes
```

### EngineErrorCode.editorCameraClampBlocksWithoutScene

```swift
case editorCameraClampBlocksWithoutScene
```

### EngineErrorCode.editorCameraClampEmptyBlocks

```swift
case editorCameraClampEmptyBlocks
```

### EngineErrorCode.editorCameraClampNoPages

```swift
case editorCameraClampNoPages
```

### EngineErrorCode.editorCameraClampPageNotLayouted

```swift
case editorCameraClampPageNotLayouted
```

### EngineErrorCode.editorCameraEntityInvalid

```swift
case editorCameraEntityInvalid
```

### EngineErrorCode.editorCameraNotValid

```swift
case editorCameraNotValid
```

### EngineErrorCode.editorCameraPositionClampNotEnabled

```swift
case editorCameraPositionClampNotEnabled
```

### EngineErrorCode.editorCameraZoomClampLimitsInvalid

```swift
case editorCameraZoomClampLimitsInvalid
```

### EngineErrorCode.editorCameraZoomClampLimitsOrder

```swift
case editorCameraZoomClampLimitsOrder
```

### EngineErrorCode.editorCameraZoomClampNotEnabled

```swift
case editorCameraZoomClampNotEnabled
```

### EngineErrorCode.editorCameraZoomLimitsNotFinite

```swift
case editorCameraZoomLimitsNotFinite
```

### EngineErrorCode.editorCommandArgTypeMismatch

```swift
case editorCommandArgTypeMismatch
```

### EngineErrorCode.editorCommandNotRegistered

```swift
case editorCommandNotRegistered
```

### EngineErrorCode.editorCommandReturnTypeMismatch

```swift
case editorCommandReturnTypeMismatch
```

### EngineErrorCode.editorCommandUnimplemented

```swift
case editorCommandUnimplemented
```

### EngineErrorCode.editorCommandWrongArgCount

```swift
case editorCommandWrongArgCount
```

### EngineErrorCode.editorCropElementNotCroppable

```swift
case editorCropElementNotCroppable
```

### EngineErrorCode.editorCropNoSelectedElement

```swift
case editorCropNoSelectedElement
```

### EngineErrorCode.editorFontDataLoadFailed

```swift
case editorFontDataLoadFailed
```

### EngineErrorCode.editorFontLoadFailed

```swift
case editorFontLoadFailed
```

### EngineErrorCode.editorFontMetricsExtractFailed

```swift
case editorFontMetricsExtractFailed
```

### EngineErrorCode.editorFontUriEmpty

```swift
case editorFontUriEmpty
```

### EngineErrorCode.editorHistoryHandleInvalid

```swift
case editorHistoryHandleInvalid
```

### EngineErrorCode.editorMemoryQueryUnavailable

```swift
case editorMemoryQueryUnavailable
```

### EngineErrorCode.editorMovementConstraintNegative

```swift
case editorMovementConstraintNegative
```

### EngineErrorCode.editorNegativeDuration

```swift
case editorNegativeDuration
```

### EngineErrorCode.editorNoSceneAvailable

```swift
case editorNoSceneAvailable
```

### EngineErrorCode.editorNoUndoStepAvailable

```swift
case editorNoUndoStepAvailable
```

### EngineErrorCode.editorPaddingNotFinite

```swift
case editorPaddingNotFinite
```

### EngineErrorCode.editorPageContentAspectRatioInvalid

```swift
case editorPageContentAspectRatioInvalid
```

### EngineErrorCode.editorPageResizeDisabled

```swift
case editorPageResizeDisabled
```

### EngineErrorCode.editorPageResizeFixedAspectOnly

```swift
case editorPageResizeFixedAspectOnly
```

### EngineErrorCode.editorPagesNotResized

```swift
case editorPagesNotResized
```

### EngineErrorCode.editorPlaybackSpeedOutOfRange

```swift
case editorPlaybackSpeedOutOfRange
```

### EngineErrorCode.editorPlaybackSpeedTooLow

```swift
case editorPlaybackSpeedTooLow
```

### EngineErrorCode.editorResourceLoadFailed

```swift
case editorResourceLoadFailed
```

### EngineErrorCode.editorResourceUriEmpty

```swift
case editorResourceUriEmpty
```

### EngineErrorCode.editorRoleNotFound

```swift
case editorRoleNotFound
```

### EngineErrorCode.editorSafeAreaInsetsNegative

```swift
case editorSafeAreaInsetsNegative
```

### EngineErrorCode.editorSafeAreaInsetsNotFinite

```swift
case editorSafeAreaInsetsNotFinite
```

### EngineErrorCode.editorSceneContentEmpty

```swift
case editorSceneContentEmpty
```

### EngineErrorCode.editorSceneDecompressFailed

```swift
case editorSceneDecompressFailed
```

### EngineErrorCode.editorSceneEntityInvalid

```swift
case editorSceneEntityInvalid
```

### EngineErrorCode.editorSceneInputInvalid

```swift
case editorSceneInputInvalid
```

### EngineErrorCode.editorSceneMissingRequiredKey

```swift
case editorSceneMissingRequiredKey
```

### EngineErrorCode.editorSceneRequiresUrlLoad

```swift
case editorSceneRequiresUrlLoad
```

### EngineErrorCode.editorSceneSizeUnavailable

```swift
case editorSceneSizeUnavailable
```

### EngineErrorCode.editorSettingEnumValueNotFound

```swift
case editorSettingEnumValueNotFound
```

### EngineErrorCode.editorSettingNotEnum

```swift
case editorSettingNotEnum
```

### EngineErrorCode.editorSettingNotFound

```swift
case editorSettingNotFound
```

### EngineErrorCode.editorSettingTypeUnsupported

```swift
case editorSettingTypeUnsupported
```

### EngineErrorCode.editorSplitBlockFailed

```swift
case editorSplitBlockFailed
```

### EngineErrorCode.editorThumbnailSamplesInvalid

```swift
case editorThumbnailSamplesInvalid
```

### EngineErrorCode.editorTouchRotateTooManyPoints

```swift
case editorTouchRotateTooManyPoints
```

### EngineErrorCode.editorTrimOffsetUndefined

```swift
case editorTrimOffsetUndefined
```

### EngineErrorCode.editorUnitConversionFailed

```swift
case editorUnitConversionFailed
```

### EngineErrorCode.editorUnsupportedSerializationFormat

```swift
case editorUnsupportedSerializationFormat
```

### EngineErrorCode.editorValueNotFinite

```swift
case editorValueNotFinite
```

### EngineErrorCode.editorVectorInvalidMirrorMode

```swift
case editorVectorInvalidMirrorMode
```

### EngineErrorCode.editorVectorNoControlPointSelected

```swift
case editorVectorNoControlPointSelected
```

### EngineErrorCode.editorVectorNodeNotDeletable

```swift
case editorVectorNodeNotDeletable
```

### EngineErrorCode.editorVectorNoNodeSelected

```swift
case editorVectorNoNodeSelected
```

### EngineErrorCode.editorVectorNoPathEditing

```swift
case editorVectorNoPathEditing
```

### EngineErrorCode.editorVideoDecodeFailed

```swift
case editorVideoDecodeFailed
```

### EngineErrorCode.editorVideoDecoderCreateFailed

```swift
case editorVideoDecoderCreateFailed
```

### EngineErrorCode.editorVideoFetchFailed

```swift
case editorVideoFetchFailed
```

### EngineErrorCode.editorVideoNotLoaded

```swift
case editorVideoNotLoaded
```

### EngineErrorCode.editorZoomAutoFitNotEnabled

```swift
case editorZoomAutoFitNotEnabled
```

### EngineErrorCode.editorZoomBlockNotLayouted

```swift
case editorZoomBlockNotLayouted
```

### EngineErrorCode.editorZoomNoCamera

```swift
case editorZoomNoCamera
```

### EngineErrorCode.encodeAudioBlockDirectExtractionUnsupported

```swift
case encodeAudioBlockDirectExtractionUnsupported
```

### EngineErrorCode.encodeAudioBlockInvalid

```swift
case encodeAudioBlockInvalid
```

### EngineErrorCode.encodeAudioBufferEmpty

```swift
case encodeAudioBufferEmpty
```

### EngineErrorCode.encodeAudioBufferNotFound

```swift
case encodeAudioBufferNotFound
```

### EngineErrorCode.encodeAudioChannelCountInvalid

```swift
case encodeAudioChannelCountInvalid
```

### EngineErrorCode.encodeAudioChunkReadFailed

```swift
case encodeAudioChunkReadFailed
```

### EngineErrorCode.encodeAudioContextNotAvailableDuringExport

```swift
case encodeAudioContextNotAvailableDuringExport
```

### EngineErrorCode.encodeAudioContextParamsInvalid

```swift
case encodeAudioContextParamsInvalid
```

### EngineErrorCode.encodeAudioContextUnavailable

```swift
case encodeAudioContextUnavailable
```

### EngineErrorCode.encodeAudioDurationInvalid

```swift
case encodeAudioDurationInvalid
```

### EngineErrorCode.encodeAudioExportOptionsNotObject

```swift
case encodeAudioExportOptionsNotObject
```

### EngineErrorCode.encodeAudioExportOptionsParseFailed

```swift
case encodeAudioExportOptionsParseFailed
```

### EngineErrorCode.encodeAudioFrameCalcInvalid

```swift
case encodeAudioFrameCalcInvalid
```

### EngineErrorCode.encodeAudioFrameSizeCalcInvalid

```swift
case encodeAudioFrameSizeCalcInvalid
```

### EngineErrorCode.encodeAudioInvalidSampleRateForTimestamp

```swift
case encodeAudioInvalidSampleRateForTimestamp
```

### EngineErrorCode.encodeAudioMimeTypeInvalid

```swift
case encodeAudioMimeTypeInvalid
```

### EngineErrorCode.encodeAudioMp4NoDataMuxed

```swift
case encodeAudioMp4NoDataMuxed
```

### EngineErrorCode.encodeAudioMuxerDestroyed

```swift
case encodeAudioMuxerDestroyed
```

### EngineErrorCode.encodeAudioNoChunksInRange

```swift
case encodeAudioNoChunksInRange
```

### EngineErrorCode.encodeAudioNoDataCaptured

```swift
case encodeAudioNoDataCaptured
```

### EngineErrorCode.encodeAudioNoPcmCollected

```swift
case encodeAudioNoPcmCollected
```

### EngineErrorCode.encodeAudioProcessingRateInvalid

```swift
case encodeAudioProcessingRateInvalid
```

### EngineErrorCode.encodeAudioSampleRateInvalid

```swift
case encodeAudioSampleRateInvalid
```

### EngineErrorCode.encodeAudioServiceUnavailable

```swift
case encodeAudioServiceUnavailable
```

### EngineErrorCode.encodeAudioSingleTrackIndexNonzero

```swift
case encodeAudioSingleTrackIndexNonzero
```

### EngineErrorCode.encodeAudioStartTimeOutOfBounds

```swift
case encodeAudioStartTimeOutOfBounds
```

### EngineErrorCode.encodeAudioTimeRangeInvalid

```swift
case encodeAudioTimeRangeInvalid
```

### EngineErrorCode.encodeAudioTimeRangeInvalidAfterTrim

```swift
case encodeAudioTimeRangeInvalidAfterTrim
```

### EngineErrorCode.encodeAudioTrackIndexOutOfBounds

```swift
case encodeAudioTrackIndexOutOfBounds
```

### EngineErrorCode.encodeAudioUnsupportedExportFormat

```swift
case encodeAudioUnsupportedExportFormat
```

### EngineErrorCode.encodeBlockMustBePage

```swift
case encodeBlockMustBePage
```

### EngineErrorCode.encodeBlockSizeZero

```swift
case encodeBlockSizeZero
```

### EngineErrorCode.encodeCancelledByBlockError

```swift
case encodeCancelledByBlockError
```

### EngineErrorCode.encodeColorMaskDataFailed

```swift
case encodeColorMaskDataFailed
```

### EngineErrorCode.encodeColorMaskDisabled

```swift
case encodeColorMaskDisabled
```

### EngineErrorCode.encodeContextAudioCreateFailed

```swift
case encodeContextAudioCreateFailed
```

### EngineErrorCode.encodeContextRenderCreateFailed

```swift
case encodeContextRenderCreateFailed
```

### EngineErrorCode.encodeDirectExtractionUnsupported

```swift
case encodeDirectExtractionUnsupported
```

### EngineErrorCode.encodeEntityInvalid

```swift
case encodeEntityInvalid
```

### EngineErrorCode.encodeEntityNotPartOfPage

```swift
case encodeEntityNotPartOfPage
```

### EngineErrorCode.encodeExportFailed

```swift
case encodeExportFailed
```

### EngineErrorCode.encodeExportOptionsNotObject

```swift
case encodeExportOptionsNotObject
```

### EngineErrorCode.encodeExportOptionsParseFailed

```swift
case encodeExportOptionsParseFailed
```

### EngineErrorCode.encodeGpuLostGeneric

```swift
case encodeGpuLostGeneric
```

### EngineErrorCode.encodeGpuLostPdf

```swift
case encodeGpuLostPdf
```

### EngineErrorCode.encodeGpuLostSvg

```swift
case encodeGpuLostSvg
```

### EngineErrorCode.encodeGroupInvalid

```swift
case encodeGroupInvalid
```

### EngineErrorCode.encodeGroupNoChildren

```swift
case encodeGroupNoChildren
```

### EngineErrorCode.encodeGroupNotInPageHierarchy

```swift
case encodeGroupNotInPageHierarchy
```

### EngineErrorCode.encodeGroupNotPartOfPage

```swift
case encodeGroupNotPartOfPage
```

### EngineErrorCode.encodeImageJpegFailed

```swift
case encodeImageJpegFailed
```

### EngineErrorCode.encodeImageJpegOom

```swift
case encodeImageJpegOom
```

### EngineErrorCode.encodeImagePngFailed

```swift
case encodeImagePngFailed
```

### EngineErrorCode.encodeImagePngOom

```swift
case encodeImagePngOom
```

### EngineErrorCode.encodeImageReadPixelsFailed

```swift
case encodeImageReadPixelsFailed
```

### EngineErrorCode.encodeImageTgaOom

```swift
case encodeImageTgaOom
```

### EngineErrorCode.encodeImageTgaRequiresRgba32

```swift
case encodeImageTgaRequiresRgba32
```

### EngineErrorCode.encodeImageUnknownMime

```swift
case encodeImageUnknownMime
```

### EngineErrorCode.encodeImageWebpFailed

```swift
case encodeImageWebpFailed
```

### EngineErrorCode.encodeImageWebpOom

```swift
case encodeImageWebpOom
```

### EngineErrorCode.encodeInsufficientResources

```swift
case encodeInsufficientResources
```

### EngineErrorCode.encodeMaskBufferFailed

```swift
case encodeMaskBufferFailed
```

### EngineErrorCode.encodeMaskColorOutOfRange

```swift
case encodeMaskColorOutOfRange
```

### EngineErrorCode.encodeMimeTypeInvalid

```swift
case encodeMimeTypeInvalid
```

### EngineErrorCode.encodeNotAllResourcesLoaded

```swift
case encodeNotAllResourcesLoaded
```

### EngineErrorCode.encodeOffscreenCanvasCreateFailed

```swift
case encodeOffscreenCanvasCreateFailed
```

### EngineErrorCode.encodeOutputSizeExceedsMax

```swift
case encodeOutputSizeExceedsMax
```

### EngineErrorCode.encodeOutputSizeInsufficientResources

```swift
case encodeOutputSizeInsufficientResources
```

### EngineErrorCode.encodePageNoChildren

```swift
case encodePageNoChildren
```

### EngineErrorCode.encodePdfCreateFailed

```swift
case encodePdfCreateFailed
```

### EngineErrorCode.encodePdfCreateFailedResources

```swift
case encodePdfCreateFailedResources
```

### EngineErrorCode.encodePdfRenderSizeExceedsMax

```swift
case encodePdfRenderSizeExceedsMax
```

### EngineErrorCode.encodePdfStagingWriteFailed

```swift
case encodePdfStagingWriteFailed
```

### EngineErrorCode.encodePixelBufferUnexpectedSize

```swift
case encodePixelBufferUnexpectedSize
```

### EngineErrorCode.encodePixelStreamNoData

```swift
case encodePixelStreamNoData
```

### EngineErrorCode.encodeRelativeUrlsNotSupported

```swift
case encodeRelativeUrlsNotSupported
```

### EngineErrorCode.encodeResourceDataEmpty

```swift
case encodeResourceDataEmpty
```

### EngineErrorCode.encodeResourceLoadFailedWithReason

```swift
case encodeResourceLoadFailedWithReason
```

### EngineErrorCode.encodeResultBufferFailed

```swift
case encodeResultBufferFailed
```

### EngineErrorCode.encodeSvgCanvasCreateFailed

```swift
case encodeSvgCanvasCreateFailed
```

### EngineErrorCode.encodeSvgColorMaskUnsupported

```swift
case encodeSvgColorMaskUnsupported
```

### EngineErrorCode.encodeSvgMemoryAllocFailed

```swift
case encodeSvgMemoryAllocFailed
```

### EngineErrorCode.encodeSvgNoData

```swift
case encodeSvgNoData
```

### EngineErrorCode.encodeTargetNotInPageHierarchy

```swift
case encodeTargetNotInPageHierarchy
```

### EngineErrorCode.encodeTrackInvalid

```swift
case encodeTrackInvalid
```

### EngineErrorCode.encodeTrackNoChildren

```swift
case encodeTrackNoChildren
```

### EngineErrorCode.encodeTrackNotInPageHierarchy

```swift
case encodeTrackNotInPageHierarchy
```

### EngineErrorCode.encodeTrackNotPartOfPage

```swift
case encodeTrackNotPartOfPage
```

### EngineErrorCode.encodeVideoBlockHasError

```swift
case encodeVideoBlockHasError
```

### EngineErrorCode.encodeVideoConcurrentEncoding

```swift
case encodeVideoConcurrentEncoding
```

### EngineErrorCode.encodeVideoExportOptionsNotObject

```swift
case encodeVideoExportOptionsNotObject
```

### EngineErrorCode.encodeVideoExportOptionsParseFailed

```swift
case encodeVideoExportOptionsParseFailed
```

### EngineErrorCode.encodeVideoFillAudioRequiresMp4

```swift
case encodeVideoFillAudioRequiresMp4
```

### EngineErrorCode.encodeVideoFillInvalid

```swift
case encodeVideoFillInvalid
```

### EngineErrorCode.encodeVideoFillNoUri

```swift
case encodeVideoFillNoUri
```

### EngineErrorCode.encodeVideoFrameFailed

```swift
case encodeVideoFrameFailed
```

### EngineErrorCode.encodeVideoHasNoAudioTracks

```swift
case encodeVideoHasNoAudioTracks
```

### EngineErrorCode.encodeVideoMimeNotMp4

```swift
case encodeVideoMimeNotMp4
```

### EngineErrorCode.encodeVideoNoAudioDuration

```swift
case encodeVideoNoAudioDuration
```

### EngineErrorCode.encodeVideoPcmReadFailed

```swift
case encodeVideoPcmReadFailed
```

### EngineErrorCode.encodeVideoResourceLoadFailed

```swift
case encodeVideoResourceLoadFailed
```

### EngineErrorCode.eventSubscriptionNotFound

```swift
case eventSubscriptionNotFound
```

### EngineErrorCode.fetchJsonFetchFailed

```swift
case fetchJsonFetchFailed
```

### EngineErrorCode.fetchJsonUriEmpty

```swift
case fetchJsonUriEmpty
```

### EngineErrorCode.fetchResourceDataEmpty

```swift
case fetchResourceDataEmpty
```

### EngineErrorCode.fetchResourceFailed

```swift
case fetchResourceFailed
```

### EngineErrorCode.fetchUriInvalid

```swift
case fetchUriInvalid
```

### EngineErrorCode.fetchUrlParseFailed

```swift
case fetchUrlParseFailed
```

### EngineErrorCode.licenseAlreadyUnlocked

```swift
case licenseAlreadyUnlocked
```

### EngineErrorCode.licenseApiServiceUnavailable

```swift
case licenseApiServiceUnavailable
```

### EngineErrorCode.licenseAvConcurrencyLimitReached

```swift
case licenseAvConcurrencyLimitReached
```

### EngineErrorCode.licenseAvSessionAcquisitionFailed

```swift
case licenseAvSessionAcquisitionFailed
```

### EngineErrorCode.licenseAvSessionRequiresApiKey

```swift
case licenseAvSessionRequiresApiKey
```

### EngineErrorCode.licenseCannotDeactivateOffline

```swift
case licenseCannotDeactivateOffline
```

### EngineErrorCode.licenseDeactivationTimeout

```swift
case licenseDeactivationTimeout
```

### EngineErrorCode.licenseEngineVersionInvalid

```swift
case licenseEngineVersionInvalid
```

### EngineErrorCode.licenseExpired

```swift
case licenseExpired
```

### EngineErrorCode.licenseIdentifierMismatch

```swift
case licenseIdentifierMismatch
```

### EngineErrorCode.licenseInvalid

```swift
case licenseInvalid
```

### EngineErrorCode.licenseInvalidApiKey

```swift
case licenseInvalidApiKey
```

### EngineErrorCode.licenseInvalidFormat

```swift
case licenseInvalidFormat
```

### EngineErrorCode.licenseMissing

```swift
case licenseMissing
```

### EngineErrorCode.licenseMissingFluendoFlag

```swift
case licenseMissingFluendoFlag
```

### EngineErrorCode.licenseMixedUnlockMethods

```swift
case licenseMixedUnlockMethods
```

### EngineErrorCode.licenseNoActiveToDeactivate

```swift
case licenseNoActiveToDeactivate
```

### EngineErrorCode.licenseNoUserId

```swift
case licenseNoUserId
```

### EngineErrorCode.licensePlatformMismatch

```swift
case licensePlatformMismatch
```

### EngineErrorCode.licenseProductMismatch

```swift
case licenseProductMismatch
```

### EngineErrorCode.licenseRequestInProgress

```swift
case licenseRequestInProgress
```

### EngineErrorCode.licenseServerError

```swift
case licenseServerError
```

### EngineErrorCode.licenseStillFetching

```swift
case licenseStillFetching
```

### EngineErrorCode.licenseTargetMismatch

```swift
case licenseTargetMismatch
```

### EngineErrorCode.licenseUnsupportedSessionType

```swift
case licenseUnsupportedSessionType
```

### EngineErrorCode.licenseVersionInvalid

```swift
case licenseVersionInvalid
```

### EngineErrorCode.mediaBlockNotAPage

```swift
case mediaBlockNotAPage
```

### EngineErrorCode.mediaBlockNotAudioOrVideoFill

```swift
case mediaBlockNotAudioOrVideoFill
```

### EngineErrorCode.mediaBlockNotPageOrChild

```swift
case mediaBlockNotPageOrChild
```

### EngineErrorCode.mediaBlockNotValid

```swift
case mediaBlockNotValid
```

### EngineErrorCode.mediaBlockNotVideoFill

```swift
case mediaBlockNotVideoFill
```

### EngineErrorCode.mediaBlockSizeZero

```swift
case mediaBlockSizeZero
```

### EngineErrorCode.mediaCanvasSurfaceGetFailed

```swift
case mediaCanvasSurfaceGetFailed
```

### EngineErrorCode.mediaChannelCountInvalid

```swift
case mediaChannelCountInvalid
```

### EngineErrorCode.mediaFrameCountInvalid

```swift
case mediaFrameCountInvalid
```

### EngineErrorCode.mediaGridDimensionsInvalid

```swift
case mediaGridDimensionsInvalid
```

### EngineErrorCode.mediaImageEncodeFailed

```swift
case mediaImageEncodeFailed
```

### EngineErrorCode.mediaNegativeTimeRange

```swift
case mediaNegativeTimeRange
```

### EngineErrorCode.mediaOffscreenCanvasGetFailed

```swift
case mediaOffscreenCanvasGetFailed
```

### EngineErrorCode.mediaOffscreenSurfaceCreateFailed

```swift
case mediaOffscreenSurfaceCreateFailed
```

### EngineErrorCode.mediaOperationUnsupportedForBlock

```swift
case mediaOperationUnsupportedForBlock
```

### EngineErrorCode.mediaSampleCountInvalid

```swift
case mediaSampleCountInvalid
```

### EngineErrorCode.mediaSamplesPerChunkInvalid

```swift
case mediaSamplesPerChunkInvalid
```

### EngineErrorCode.mediaSnapshotFailed

```swift
case mediaSnapshotFailed
```

### EngineErrorCode.mediaThumbnailAllocFailed

```swift
case mediaThumbnailAllocFailed
```

### EngineErrorCode.mediaThumbnailHeightInvalid

```swift
case mediaThumbnailHeightInvalid
```

### EngineErrorCode.mediaThumbnailUpscaleFailed

```swift
case mediaThumbnailUpscaleFailed
```

### EngineErrorCode.mediaUpscaleSurfaceCreateFailed

```swift
case mediaUpscaleSurfaceCreateFailed
```

### EngineErrorCode.mediaVideoFetchFailed

```swift
case mediaVideoFetchFailed
```

### EngineErrorCode.sceneArchivalRequestFailed

```swift
case sceneArchivalRequestFailed
```

### EngineErrorCode.sceneArchiveAddResourceFailed

```swift
case sceneArchiveAddResourceFailed
```

### EngineErrorCode.sceneArchiveChunkReadFailed

```swift
case sceneArchiveChunkReadFailed
```

### EngineErrorCode.sceneArchiveCorruptedEmptyResource

```swift
case sceneArchiveCorruptedEmptyResource
```

### EngineErrorCode.sceneArchiveCreateFailed

```swift
case sceneArchiveCreateFailed
```

### EngineErrorCode.sceneArchiveDataProviderRangeUnavailable

```swift
case sceneArchiveDataProviderRangeUnavailable
```

### EngineErrorCode.sceneArchiveDataUnavailableForUrl

```swift
case sceneArchiveDataUnavailableForUrl
```

### EngineErrorCode.sceneArchiveFetchFailed

```swift
case sceneArchiveFetchFailed
```

### EngineErrorCode.sceneArchiveInvalid

```swift
case sceneArchiveInvalid
```

### EngineErrorCode.sceneArchiveLoadAsBlocksNotScene

```swift
case sceneArchiveLoadAsBlocksNotScene
```

### EngineErrorCode.sceneArchiveLoadAsSceneNotBlocks

```swift
case sceneArchiveLoadAsSceneNotBlocks
```

### EngineErrorCode.sceneArchiveMissingFile

```swift
case sceneArchiveMissingFile
```

### EngineErrorCode.sceneArchiveNoCurrentResource

```swift
case sceneArchiveNoCurrentResource
```

### EngineErrorCode.sceneArchiveNoResourceBegun

```swift
case sceneArchiveNoResourceBegun
```

### EngineErrorCode.sceneArchiveOffsetExceedsResourceSize

```swift
case sceneArchiveOffsetExceedsResourceSize
```

### EngineErrorCode.sceneArchiveResourceAlreadyBegun

```swift
case sceneArchiveResourceAlreadyBegun
```

### EngineErrorCode.sceneArchiveResourceDataInvalid

```swift
case sceneArchiveResourceDataInvalid
```

### EngineErrorCode.sceneArchiveResourceDataUnavailable

```swift
case sceneArchiveResourceDataUnavailable
```

### EngineErrorCode.sceneArchiveResourcesTooLarge

```swift
case sceneArchiveResourcesTooLarge
```

### EngineErrorCode.sceneArchiveStreamedWriteFailed

```swift
case sceneArchiveStreamedWriteFailed
```

### EngineErrorCode.sceneArchiveWriterAlreadyInitialized

```swift
case sceneArchiveWriterAlreadyInitialized
```

### EngineErrorCode.sceneArchiveWriterNotInitialized

```swift
case sceneArchiveWriterNotInitialized
```

### EngineErrorCode.sceneBlockAtIndexInvalid

```swift
case sceneBlockAtIndexInvalid
```

### EngineErrorCode.sceneBlocksInputInvalid

```swift
case sceneBlocksInputInvalid
```

### EngineErrorCode.sceneCompressionServiceUnavailable

```swift
case sceneCompressionServiceUnavailable
```

### EngineErrorCode.sceneContentEmpty

```swift
case sceneContentEmpty
```

### EngineErrorCode.sceneDecompressFailed

```swift
case sceneDecompressFailed
```

### EngineErrorCode.sceneDisallowedSchemes

```swift
case sceneDisallowedSchemes
```

### EngineErrorCode.sceneEntityInvalid

```swift
case sceneEntityInvalid
```

### EngineErrorCode.sceneEntityNotAScene

```swift
case sceneEntityNotAScene
```

### EngineErrorCode.sceneLoadFromUriFailed

```swift
case sceneLoadFromUriFailed
```

### EngineErrorCode.sceneMediaUriNotFound

```swift
case sceneMediaUriNotFound
```

### EngineErrorCode.sceneMediaUriParseFailed

```swift
case sceneMediaUriParseFailed
```

### EngineErrorCode.sceneMustExist

```swift
case sceneMustExist
```

### EngineErrorCode.sceneMustExistForTemplate

```swift
case sceneMustExistForTemplate
```

### EngineErrorCode.sceneNoMode

```swift
case sceneNoMode
```

### EngineErrorCode.sceneNoPageFound

```swift
case sceneNoPageFound
```

### EngineErrorCode.sceneNoPagesForAudioExport

```swift
case sceneNoPagesForAudioExport
```

### EngineErrorCode.sceneNoSceneFound

```swift
case sceneNoSceneFound
```

### EngineErrorCode.sceneNotImplemented

```swift
case sceneNotImplemented
```

### EngineErrorCode.sceneNotSceneType

```swift
case sceneNotSceneType
```

### EngineErrorCode.sceneNotValid

```swift
case sceneNotValid
```

### EngineErrorCode.sceneTempFileCreateFailed

```swift
case sceneTempFileCreateFailed
```

### EngineErrorCode.sceneZipChunkWriteFailed

```swift
case sceneZipChunkWriteFailed
```

### EngineErrorCode.sceneZipCreateFailed

```swift
case sceneZipCreateFailed
```

### EngineErrorCode.sceneZipDirectoryEntryCloseFailed

```swift
case sceneZipDirectoryEntryCloseFailed
```

### EngineErrorCode.sceneZipDirectoryEntryOpenFailed

```swift
case sceneZipDirectoryEntryOpenFailed
```

### EngineErrorCode.sceneZipEntryCloseFailed

```swift
case sceneZipEntryCloseFailed
```

### EngineErrorCode.sceneZipEntryOpenFailed

```swift
case sceneZipEntryOpenFailed
```

### EngineErrorCode.sceneZipEntryWriteFailed

```swift
case sceneZipEntryWriteFailed
```

### EngineErrorCode.sceneZipStreamingEntryCloseFailed

```swift
case sceneZipStreamingEntryCloseFailed
```

### EngineErrorCode.sceneZipStreamingEntryOpenFailed

```swift
case sceneZipStreamingEntryOpenFailed
```

### EngineErrorCode.sceneZipWriterCloseFailed

```swift
case sceneZipWriterCloseFailed
```

### EngineErrorCode.sceneZipWriterCreateFailed

```swift
case sceneZipWriterCreateFailed
```

### EngineErrorCode.sceneZipWriterOpenFailed

```swift
case sceneZipWriterOpenFailed
```

### EngineErrorCode.utilsApngDataTooSmall

```swift
case utilsApngDataTooSmall
```

### EngineErrorCode.utilsApngFctlBeforeActl

```swift
case utilsApngFctlBeforeActl
```

### EngineErrorCode.utilsApngFdatWithoutFctl

```swift
case utilsApngFdatWithoutFctl
```

### EngineErrorCode.utilsApngFdatWithoutSeq

```swift
case utilsApngFdatWithoutSeq
```

### EngineErrorCode.utilsApngFrameIndexOutOfRange

```swift
case utilsApngFrameIndexOutOfRange
```

### EngineErrorCode.utilsApngFrameNoPixelData

```swift
case utilsApngFrameNoPixelData
```

### EngineErrorCode.utilsApngFrameOutOfCanvas

```swift
case utilsApngFrameOutOfCanvas
```

### EngineErrorCode.utilsApngFrameZeroDimensions

```swift
case utilsApngFrameZeroDimensions
```

### EngineErrorCode.utilsApngIdatBeforeIhdr

```swift
case utilsApngIdatBeforeIhdr
```

### EngineErrorCode.utilsApngInvalidActl

```swift
case utilsApngInvalidActl
```

### EngineErrorCode.utilsApngInvalidFctl

```swift
case utilsApngInvalidFctl
```

### EngineErrorCode.utilsApngInvalidIhdr

```swift
case utilsApngInvalidIhdr
```

### EngineErrorCode.utilsApngInvalidSignature

```swift
case utilsApngInvalidSignature
```

### EngineErrorCode.utilsApngMissingActl

```swift
case utilsApngMissingActl
```

### EngineErrorCode.utilsApngMissingIhdr

```swift
case utilsApngMissingIhdr
```

### EngineErrorCode.utilsApngNoFrames

```swift
case utilsApngNoFrames
```

### EngineErrorCode.utilsApngZeroCanvas

```swift
case utilsApngZeroCanvas
```

### EngineErrorCode.utilsCaptionDataUnavailable

```swift
case utilsCaptionDataUnavailable
```

### EngineErrorCode.utilsCaptionParseEmpty

```swift
case utilsCaptionParseEmpty
```

### EngineErrorCode.utilsCaptionUnsupportedMime

```swift
case utilsCaptionUnsupportedMime
```

### EngineErrorCode.utilsCaptionUtf16InvalidSize

```swift
case utilsCaptionUtf16InvalidSize
```

### EngineErrorCode.utilsCompressionEmptyData

```swift
case utilsCompressionEmptyData
```

### EngineErrorCode.utilsCompressionFormatNoneForCompress

```swift
case utilsCompressionFormatNoneForCompress
```

### EngineErrorCode.utilsCompressionFormatNoneForDecompress

```swift
case utilsCompressionFormatNoneForDecompress
```

### EngineErrorCode.utilsCompressionFormatUnsupported

```swift
case utilsCompressionFormatUnsupported
```

### EngineErrorCode.utilsCompressionNoMagicBytes

```swift
case utilsCompressionNoMagicBytes
```

### EngineErrorCode.utilsCompressionZstdInvalidFrame

```swift
case utilsCompressionZstdInvalidFrame
```

### EngineErrorCode.utilsEngineUnknownComponentType

```swift
case utilsEngineUnknownComponentType
```

### EngineErrorCode.utilsEnumValueInvalid

```swift
case utilsEnumValueInvalid
```

### EngineErrorCode.utilsFileAllocFailed

```swift
case utilsFileAllocFailed
```

### EngineErrorCode.utilsFileMapFailed

```swift
case utilsFileMapFailed
```

### EngineErrorCode.utilsFileOpenFailed

```swift
case utilsFileOpenFailed
```

### EngineErrorCode.utilsFileReadFailed

```swift
case utilsFileReadFailed
```

### EngineErrorCode.utilsFileSizeFailed

```swift
case utilsFileSizeFailed
```

### EngineErrorCode.utilsFileTooLarge

```swift
case utilsFileTooLarge
```

### EngineErrorCode.utilsGifParseFailed

```swift
case utilsGifParseFailed
```

### EngineErrorCode.utilsMetaanyExpectedArray

```swift
case utilsMetaanyExpectedArray
```

### EngineErrorCode.utilsMetaanyItemMapFailed

```swift
case utilsMetaanyItemMapFailed
```

### EngineErrorCode.utilsMetaanyMemberMapFailed

```swift
case utilsMetaanyMemberMapFailed
```

### EngineErrorCode.utilsMetaanyMissingProperty

```swift
case utilsMetaanyMissingProperty
```

### EngineErrorCode.utilsMetaanyNonStringToString

```swift
case utilsMetaanyNonStringToString
```

### EngineErrorCode.utilsMetaanyResultTypeNotReflected

```swift
case utilsMetaanyResultTypeNotReflected
```

### EngineErrorCode.utilsMetaanySetFailed

```swift
case utilsMetaanySetFailed
```

### EngineErrorCode.utilsMetaanyTypeNeedsReflection

```swift
case utilsMetaanyTypeNeedsReflection
```

### EngineErrorCode.utilsMetaanyUndefined

```swift
case utilsMetaanyUndefined
```

### EngineErrorCode.utilsMetaanyUnhandledIntegral

```swift
case utilsMetaanyUnhandledIntegral
```

### EngineErrorCode.utilsMetaanyUnhandledSequence

```swift
case utilsMetaanyUnhandledSequence
```

### EngineErrorCode.utilsMetaanyUnhandledTypeKind

```swift
case utilsMetaanyUnhandledTypeKind
```

### EngineErrorCode.utilsMetaTypeFunctionUnknown

```swift
case utilsMetaTypeFunctionUnknown
```

### EngineErrorCode.utilsMetaTypeInvalid

```swift
case utilsMetaTypeInvalid
```

### EngineErrorCode.utilsMetaTypeInvokeFailed

```swift
case utilsMetaTypeInvokeFailed
```

### EngineErrorCode.utilsMkvEbmlParseFailed

```swift
case utilsMkvEbmlParseFailed
```

### EngineErrorCode.utilsMkvInvalidData

```swift
case utilsMkvInvalidData
```

### EngineErrorCode.utilsMkvNoTracks

```swift
case utilsMkvNoTracks
```

### EngineErrorCode.utilsMkvSegmentCreateFailed

```swift
case utilsMkvSegmentCreateFailed
```

### EngineErrorCode.utilsMkvSegmentLoadFailed

```swift
case utilsMkvSegmentLoadFailed
```

### EngineErrorCode.utilsMp4AudioCodecUnsupported

```swift
case utilsMp4AudioCodecUnsupported
```

### EngineErrorCode.utilsMp4AudioTrackIndexOutOfBounds

```swift
case utilsMp4AudioTrackIndexOutOfBounds
```

### EngineErrorCode.utilsMp4OpenFailed

```swift
case utilsMp4OpenFailed
```

### EngineErrorCode.utilsMp4VideoCodecUnsupported

```swift
case utilsMp4VideoCodecUnsupported
```

### EngineErrorCode.utilsPixelBufferBackendTextureIncomplete

```swift
case utilsPixelBufferBackendTextureIncomplete
```

### EngineErrorCode.utilsPixelBufferGlTextureInfoFailed

```swift
case utilsPixelBufferGlTextureInfoFailed
```

### EngineErrorCode.utilsPixelBufferInvalidImage

```swift
case utilsPixelBufferInvalidImage
```

### EngineErrorCode.utilsPixelBufferNoBackendTexture

```swift
case utilsPixelBufferNoBackendTexture
```

### EngineErrorCode.utilsPixelBufferNoCanvas

```swift
case utilsPixelBufferNoCanvas
```

### EngineErrorCode.utilsPixelBufferNoGpuContext

```swift
case utilsPixelBufferNoGpuContext
```

### EngineErrorCode.utilsPixelBufferNotStreamFill

```swift
case utilsPixelBufferNotStreamFill
```

### EngineErrorCode.utilsPixelBufferUnsupportedFormat

```swift
case utilsPixelBufferUnsupportedFormat
```

### EngineErrorCode.utilsReflectionBlockNotValid

```swift
case utilsReflectionBlockNotValid
```

### EngineErrorCode.utilsReflectionComponentNotReflected

```swift
case utilsReflectionComponentNotReflected
```

### EngineErrorCode.utilsReflectionComponentNotSet

```swift
case utilsReflectionComponentNotSet
```

### EngineErrorCode.utilsReflectionEntityMissingComponent

```swift
case utilsReflectionEntityMissingComponent
```

### EngineErrorCode.utilsReflectionKeyNotFound

```swift
case utilsReflectionKeyNotFound
```

### EngineErrorCode.utilsReflectionKeyPathEmpty

```swift
case utilsReflectionKeyPathEmpty
```

### EngineErrorCode.utilsReflectionKeyPathMemberMissing

```swift
case utilsReflectionKeyPathMemberMissing
```

### EngineErrorCode.utilsReflectionMemberNotAccessibleByRef

```swift
case utilsReflectionMemberNotAccessibleByRef
```

### EngineErrorCode.utilsReflectionMemberNotFound

```swift
case utilsReflectionMemberNotFound
```

### EngineErrorCode.utilsReflectionMemberTypeNotReflected

```swift
case utilsReflectionMemberTypeNotReflected
```

### EngineErrorCode.utilsReflectionNoMembersForPrefix

```swift
case utilsReflectionNoMembersForPrefix
```

### EngineErrorCode.utilsReflectionSetMemberFailed

```swift
case utilsReflectionSetMemberFailed
```

### EngineErrorCode.utilsReflectionSetWildcardTypeMismatch

```swift
case utilsReflectionSetWildcardTypeMismatch
```

### EngineErrorCode.utilsReflectionTypeNoMembers

```swift
case utilsReflectionTypeNoMembers
```

### EngineErrorCode.utilsReflectionTypeNotReflected

```swift
case utilsReflectionTypeNotReflected
```

### EngineErrorCode.utilsReflectionUnsupportedType

```swift
case utilsReflectionUnsupportedType
```

### EngineErrorCode.utilsReflectionWildcardNotTail

```swift
case utilsReflectionWildcardNotTail
```

### EngineErrorCode.utilsReflectionWildcardSetPartial

```swift
case utilsReflectionWildcardSetPartial
```

### EngineErrorCode.utilsReflectionWildcardTypeMismatch

```swift
case utilsReflectionWildcardTypeMismatch
```

### EngineErrorCode.utilsReflectionWildcardValueMismatch

```swift
case utilsReflectionWildcardValueMismatch
```

### EngineErrorCode.utilsSettingNoArgs

```swift
case utilsSettingNoArgs
```

### EngineErrorCode.utilsStdExpectedStringError

```swift
case utilsStdExpectedStringError
```

### EngineErrorCode.utilsStorageKeyNotFound

```swift
case utilsStorageKeyNotFound
```

### EngineErrorCode.utilsTrackingNotEnabled

```swift
case utilsTrackingNotEnabled
```

### EngineErrorCode.utilsUriNonAscii

```swift
case utilsUriNonAscii
```

### EngineErrorCode.utilsUriParseFailed

```swift
case utilsUriParseFailed
```

### EngineErrorCode.utilsWavDataBeforeFmt

```swift
case utilsWavDataBeforeFmt
```

### EngineErrorCode.utilsWavFmtChunkTooSmall

```swift
case utilsWavFmtChunkTooSmall
```

### EngineErrorCode.utilsWavInvalidBitsPerSample

```swift
case utilsWavInvalidBitsPerSample
```

### EngineErrorCode.utilsWavMissingFmtOrData

```swift
case utilsWavMissingFmtOrData
```

### EngineErrorCode.utilsWavNotWave

```swift
case utilsWavNotWave
```

### EngineErrorCode.utilsWavTruncatedFmtChunk

```swift
case utilsWavTruncatedFmtChunk
```

### EngineErrorCode.utilsWavTruncatedRiffHeader

```swift
case utilsWavTruncatedRiffHeader
```

### EngineErrorCode.utilsWavTruncatedUnknownChunk

```swift
case utilsWavTruncatedUnknownChunk
```

### EngineErrorCode.utilsWavUnsupportedAudioFormat

```swift
case utilsWavUnsupportedAudioFormat
```

### EngineErrorCode.utilsWavZeroChannels

```swift
case utilsWavZeroChannels
```

### EngineErrorCode.utilsWavZeroSampleRate

```swift
case utilsWavZeroSampleRate
```

### EngineErrorCode.utilsWavZeroSizeChunk

```swift
case utilsWavZeroSizeChunk
```

### EngineErrorCode.utilsZstdCompressFailed

```swift
case utilsZstdCompressFailed
```

### EngineErrorCode.utilsZstdDecompressFailed

```swift
case utilsZstdDecompressFailed
```

### init(rawValue:)

```swift
init?(rawValue: String)
```
