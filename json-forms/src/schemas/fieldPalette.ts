export type FieldKind = 'string' | 'integer' | 'number' | 'boolean' | 'select' | 'date'

export type FieldTemplate = {
	kind: FieldKind
	label: string
	defaultTitle: string
	defaultName: string
	defaultRequired?: boolean
	defaultEnum?: string[]
}

export const FIELD_PALETTE: FieldTemplate[] = [
	{
		kind: 'string',
		label: 'Text',
		defaultTitle: 'Text',
		defaultName: 'text',
	},
	{
		kind: 'integer',
		label: 'Integer',
		defaultTitle: 'Integer',
		defaultName: 'integer',
	},
	{
		kind: 'number',
		label: 'Number',
		defaultTitle: 'Number',
		defaultName: 'number',
	},
	{
		kind: 'boolean',
		label: 'Checkbox',
		defaultTitle: 'Checkbox',
		defaultName: 'checkbox',
	},
	{
		kind: 'select',
		label: 'Select',
		defaultTitle: 'Select',
		defaultName: 'select',
		defaultEnum: ['Option A', 'Option B'],
	},
	{
		kind: 'date',
		label: 'Date',
		defaultTitle: 'Date',
		defaultName: 'date',
	},
]
