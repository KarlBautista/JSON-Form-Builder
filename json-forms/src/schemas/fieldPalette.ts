export type FieldKind =
	| 'string'
	| 'textarea'
	| 'email'
	| 'password'
	| 'url'
	| 'integer'
	| 'number'
	| 'boolean'
	| 'select'
	| 'radio'
	| 'multiselect'
	| 'date'
	| 'datetime'

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
		kind: 'textarea',
		label: 'Textarea',
		defaultTitle: 'Long text',
		defaultName: 'longText',
	},
	{
		kind: 'email',
		label: 'Email',
		defaultTitle: 'Email',
		defaultName: 'email',
	},
	{
		kind: 'password',
		label: 'Password',
		defaultTitle: 'Password',
		defaultName: 'password',
	},
	{
		kind: 'url',
		label: 'URL',
		defaultTitle: 'Website',
		defaultName: 'website',
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
		kind: 'radio',
		label: 'Radio',
		defaultTitle: 'Radio',
		defaultName: 'radio',
		defaultEnum: ['Option A', 'Option B'],
	},
	{
		kind: 'multiselect',
		label: 'Multi-select',
		defaultTitle: 'Multi-select',
		defaultName: 'multiSelect',
		defaultEnum: ['Option A', 'Option B'],
	},
	{
		kind: 'date',
		label: 'Date',
		defaultTitle: 'Date',
		defaultName: 'date',
	},
	{
		kind: 'datetime',
		label: 'Date & time',
		defaultTitle: 'Date & time',
		defaultName: 'dateTime',
	},
]
