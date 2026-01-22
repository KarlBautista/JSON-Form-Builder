import { useCallback, useMemo, useState } from 'react'
import type { RJSFSchema, UiSchema } from '@rjsf/utils'
import type { FieldKind, FieldTemplate } from '../../schemas/fieldPalette'
import { EMPTY_OBJECT_SCHEMA } from '../../schemas/emptyObjectSchema'

export type BuilderField = {
	id: string
	kind: FieldKind
	name: string
	title: string
	required: boolean
	enumValues?: string[]
}

function sanitizeName(raw: string): string {
	const trimmed = raw.trim()
	if (!trimmed) return ''
	return trimmed.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '_')
}

function makeId(): string {
	return `f_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`
}

function uniqueName(baseName: string, taken: Set<string>): string {
	const base = sanitizeName(baseName) || 'field'
	if (!taken.has(base)) return base
	let i = 2
	while (taken.has(`${base}${i}`)) i += 1
	return `${base}${i}`
}

export function useSchemaBuilder() {
	const [title, setTitle] = useState<string>(EMPTY_OBJECT_SCHEMA.title ?? 'Untitled schema')
	const [fields, setFields] = useState<BuilderField[]>([])

	const addFromTemplate = useCallback((template: FieldTemplate) => {
		setFields((current) => {
			const taken = new Set(current.map((f) => f.name))
			const name = uniqueName(template.defaultName, taken)
			const wantsEnum = template.kind === 'select' || template.kind === 'radio' || template.kind === 'multiselect'
			const field: BuilderField = {
				id: makeId(),
				kind: template.kind,
				name,
				title: template.defaultTitle,
				required: Boolean(template.defaultRequired),
				enumValues: wantsEnum ? template.defaultEnum ?? ['Option A'] : undefined,
			}
			return [...current, field]
		})
	}, [])

	const removeField = useCallback((id: string) => {
		setFields((current) => current.filter((f) => f.id !== id))
	}, [])

	const updateField = useCallback((id: string, patch: Partial<BuilderField>) => {
		setFields((current) =>
			current.map((f) => {
				if (f.id !== id) return f
				const next: BuilderField = { ...f, ...patch }
				if (typeof patch.name === 'string') next.name = sanitizeName(patch.name)
				const wantsEnum = next.kind === 'select' || next.kind === 'radio' || next.kind === 'multiselect'
				if (!wantsEnum) next.enumValues = undefined
				return next
			}),
		)
	}, [])

	const moveField = useCallback((activeId: string, overId: string) => {
		setFields((current) => {
			const oldIndex = current.findIndex((f) => f.id === activeId)
			const newIndex = current.findIndex((f) => f.id === overId)
			if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return current
			const next = current.slice()
			const [moved] = next.splice(oldIndex, 1)
			next.splice(newIndex, 0, moved)
			return next
		})
	}, [])

	const validation = useMemo(() => {
		const errors: string[] = []
		const names = fields.map((f) => f.name)
		const empty = fields.filter((f) => !f.name.trim())
		if (empty.length) errors.push('One or more fields has an empty `name`.')
		const duplicates = names.filter((n, i) => n && names.indexOf(n) !== i)
		if (duplicates.length) errors.push(`Duplicate field names: ${Array.from(new Set(duplicates)).join(', ')}`)
		return { isValid: errors.length === 0, errors }
	}, [fields])

	const schema: RJSFSchema = useMemo(() => {
		const properties: Record<string, any> = {}
		const required: string[] = []

		for (const field of fields) {
			if (!field.name) continue
			const prop: any = { title: field.title || field.name }
			if (field.kind === 'select' || field.kind === 'radio') {
				prop.type = 'string'
				prop.enum = (field.enumValues ?? []).filter(Boolean)
			} else if (field.kind === 'multiselect') {
				prop.type = 'array'
				prop.uniqueItems = true
				prop.items = {
					type: 'string',
					enum: (field.enumValues ?? []).filter(Boolean),
				}
			} else if (field.kind === 'date') {
				prop.type = 'string'
				prop.format = 'date'
			} else if (field.kind === 'datetime') {
				prop.type = 'string'
				prop.format = 'date-time'
			} else if (field.kind === 'email') {
				prop.type = 'string'
				prop.format = 'email'
			} else if (field.kind === 'url') {
				prop.type = 'string'
				prop.format = 'uri'
			} else if (field.kind === 'textarea' || field.kind === 'password') {
				prop.type = 'string'
			} else {
				prop.type = field.kind
			}
			properties[field.name] = prop
			if (field.required) required.push(field.name)
		}

		const next: RJSFSchema = {
			title: title || 'Untitled schema',
			type: 'object',
			properties,
		}

		if (required.length) next.required = required
		return next
	}, [fields, title])

	const uiSchema: UiSchema = useMemo(() => {
		const next: UiSchema = {
			'ui:order': fields.map((f) => f.name).filter(Boolean),
		}

		for (const field of fields) {
			if (!field.name) continue
			next[field.name] = {
				...(field.kind === 'boolean' ? { 'ui:widget': 'checkbox' } : null),
				...(field.kind === 'date' ? { 'ui:widget': 'date' } : null),
				...(field.kind === 'datetime' ? { 'ui:widget': 'alt-datetime' } : null),
				...(field.kind === 'select' ? { 'ui:widget': 'select' } : null),
				...(field.kind === 'radio' ? { 'ui:widget': 'radio' } : null),
				...(field.kind === 'multiselect' ? { 'ui:widget': 'checkboxes' } : null),
				...(field.kind === 'textarea' ? { 'ui:widget': 'textarea' } : null),
				...(field.kind === 'password' ? { 'ui:widget': 'password' } : null),
				'ui:placeholder': field.title || field.name,
			}
		}

		return next
	}, [fields])

	return {
		title,
		setTitle,
		fields,
		schema,
		uiSchema,
		validation,
		addFromTemplate,
		removeField,
		updateField,
		moveField,
	}
}