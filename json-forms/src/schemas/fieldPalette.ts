import {
	Calendar,
	CheckSquare,
	ChevronDown,
	CircleDot,
	Clock,
	Hash,
	Link,
	ListChecks,
	Lock,
	Mail,
	Pilcrow,
	Type,
} from 'lucide-react'
import type React from 'react'

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
	icon: React.ElementType
}

export const FIELD_PALETTE: FieldTemplate[] = [
	{
		kind: 'string',
		label: 'Text',
		defaultTitle: 'Text',
		defaultName: 'text',
		icon: Type,
	},
	{
		kind: 'textarea',
		label: 'Textarea',
		defaultTitle: 'Long text',
		defaultName: 'longText',
		icon: Pilcrow,
	},
	{
		kind: 'email',
		label: 'Email',
		defaultTitle: 'Email',
		defaultName: 'email',
		icon: Mail,
	},
	{
		kind: 'password',
		label: 'Password',
		defaultTitle: 'Password',
		defaultName: 'password',
		icon: Lock,
	},
	{
		kind: 'url',
		label: 'URL',
		defaultTitle: 'Website',
		defaultName: 'website',
		icon: Link,
	},
	{
		kind: 'integer',
		label: 'Integer',
		defaultTitle: 'Integer',
		defaultName: 'integer',
		icon: Hash,
	},
	{
		kind: 'number',
		label: 'Number',
		defaultTitle: 'Number',
		defaultName: 'number',
		icon: Hash,
	},
	{
		kind: 'boolean',
		label: 'Checkbox',
		defaultTitle: 'Checkbox',
		defaultName: 'checkbox',
		icon: CheckSquare,
	},
	{
		kind: 'select',
		label: 'Select',
		defaultTitle: 'Select',
		defaultName: 'select',
		defaultEnum: ['Option A', 'Option B'],
		icon: ChevronDown,
	},
	{
		kind: 'radio',
		label: 'Radio',
		defaultTitle: 'Radio',
		defaultName: 'radio',
		defaultEnum: ['Option A', 'Option B'],
		icon: CircleDot,
	},
	{
		kind: 'multiselect',
		label: 'Multi-select',
		defaultTitle: 'Multi-select',
		defaultName: 'multiSelect',
		defaultEnum: ['Option A', 'Option B'],
		icon: ListChecks,
	},
	{
		kind: 'date',
		label: 'Date',
		defaultTitle: 'Date',
		defaultName: 'date',
		icon: Calendar,
	},
	{
		kind: 'datetime',
		label: 'Date & time',
		defaultTitle: 'Date & time',
		defaultName: 'dateTime',
		icon: Clock,
	},
]
