export interface OptionValue {
  id: string
  label: string
  priceDelta: number
  providerValue?: string
}

export interface ModelOption {
  id: string
  label: string
  type: 'select'
  values: OptionValue[]
  defaultId: string
}

export interface Model {
  id: string
  label: string
  providerId: 'kie'
  providerModelId: string
  basePrice: number
  options: ModelOption[]
}

// Internal catalog (includes providerModelId and providerValue)
const FULL_CATALOG: Model[] = [
  {
    id: 'nano-banana-pro',
    label: 'Nano Banana Pro',
    providerId: 'kie',
    providerModelId: 'nano-banana-2',
    basePrice: 2,
    options: [
      {
        id: 'resolution',
        label: 'Разрешение',
        type: 'select',
        values: [
          { id: '1K', label: '1K', priceDelta: 0, providerValue: '1024' },
          { id: '2K', label: '2K', priceDelta: 1, providerValue: '2048' },
          { id: '4K', label: '4K', priceDelta: 2, providerValue: '4096' },
        ],
        defaultId: '1K',
      },
      {
        id: 'aspect_ratio',
        label: 'Соотношение сторон',
        type: 'select',
        values: [
          { id: '1:1', label: '1:1', priceDelta: 0 },
          { id: '4:3', label: '4:3', priceDelta: 0 },
          { id: '16:9', label: '16:9', priceDelta: 0 },
          { id: '9:16', label: '9:16', priceDelta: 0 },
          { id: '3:2', label: '3:2', priceDelta: 0 },
          { id: '2:3', label: '2:3', priceDelta: 0 },
          { id: '4:5', label: '4:5', priceDelta: 0 },
          { id: '5:4', label: '5:4', priceDelta: 0 },
          { id: '21:9', label: '21:9', priceDelta: 0 },
        ],
        defaultId: '1:1',
      },
      {
        id: 'output_format',
        label: 'Формат',
        type: 'select',
        values: [
          { id: 'jpg', label: 'JPG', priceDelta: 0, providerValue: 'jpg' },
          { id: 'png', label: 'PNG', priceDelta: 0, providerValue: 'png' },
        ],
        defaultId: 'jpg',
      },
    ],
  },
];

export function computePrice(
  modelId: string,
  selectedOptions: Record<string, string>
): number {
  const model = FULL_CATALOG.find((m) => m.id === modelId);
  if (!model) {
    throw new Error(`Model "${modelId}" not found in catalog`);
  }

  let total = model.basePrice;

  for (const option of model.options) {
    const selectedValueId = selectedOptions[option.id];
    if (!selectedValueId) continue;

    const value = option.values.find((v) => v.id === selectedValueId);
    if (value) {
      total += value.priceDelta;
    }
  }

  return total;
}

// Public catalog (strips internal fields)
export type PublicOptionValue = Omit<OptionValue, 'providerValue'>;
export type PublicModelOption = Omit<ModelOption, 'values'> & {
  values: PublicOptionValue[];
};
export type PublicModel = Omit<Model, 'providerModelId' | 'options'> & {
  options: PublicModelOption[];
};

function stripPrivateFields(catalog: Model[]): PublicModel[] {
  return catalog.map((model) => ({
    id: model.id,
    label: model.label,
    providerId: model.providerId,
    basePrice: model.basePrice,
    options: model.options.map((option) => ({
      id: option.id,
      label: option.label,
      type: option.type,
      defaultId: option.defaultId,
      values: option.values.map((value) => ({
        id: value.id,
        label: value.label,
        priceDelta: value.priceDelta,
      })),
    })),
  }));
}

export const PUBLIC_CATALOG = stripPrivateFields(FULL_CATALOG);

export function getFullModel(modelId: string): Model | undefined {
  return FULL_CATALOG.find((m) => m.id === modelId);
}
