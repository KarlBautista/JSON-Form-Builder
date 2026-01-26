import { useState, useEffect } from 'react'
import type { RJSFSchema } from '@rjsf/utils'

type Props = {
	schema: RJSFSchema
	errors?: string[]
	onSchemaChange?: (schema: RJSFSchema) => void
}

export default function JsonSchemaPanel({ schema, errors, onSchemaChange }: Props) {
	const [isEditing, setIsEditing] = useState(false)
	const [schemaText, setSchemaText] = useState('')
	const [parseError, setParseError] = useState<string | null>(null)

	useEffect(() => {
		if (!isEditing) {
			setSchemaText(JSON.stringify(schema, null, 2))
		}
	}, [schema, isEditing])

	const handleApply = () => {
		try {
			const parsed = JSON.parse(schemaText)
			setParseError(null)
			onSchemaChange?.(parsed)
			setIsEditing(false)
		} catch (e) {
			setParseError(e instanceof Error ? e.message : 'Invalid JSON')
		}
	}

	return (
		<div className="rounded-[1.5rem] bg-white p-5 shadow-lg shadow-slate-200/50 ring-1 ring-slate-100">
			<div className="flex items-center justify-between gap-3 mb-3">
				<h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">JSON Schema</h2>
				{onSchemaChange && (
					<button
						onClick={() => {
							if (isEditing) {
								handleApply()
							} else {
								setIsEditing(true)
							}
						}}
						className="rounded-lg bg-[#42855B]/10 px-3 py-1 text-xs font-semibold text-[#42855B] hover:bg-[#42855B]/20 transition-colors"
					>
						{isEditing ? 'Apply' : 'Edit'}
					</button>
				)}
			</div>

			{errors?.length ? (
				<div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
					<div className="font-semibold">Fix before submit</div>
					<ul className="mt-1 list-disc pl-5">
						{errors.map((e) => (
							<li key={e}>{e}</li>
						))}
					</ul>
				</div>
			) : null}

			{parseError && (
				<div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
					<div className="font-semibold">Parse Error</div>
					<div className="mt-1">{parseError}</div>
				</div>
			)}

			{isEditing ? (
				<textarea
					value={schemaText}
					onChange={(e) => setSchemaText(e.target.value)}
					className="mt-3 max-h-[70vh] w-full overflow-auto rounded-2xl border border-stone-200 bg-stone-950 p-3 font-mono text-xs text-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
					rows={20}
				/>
			) : (
				<pre className="mt-3 max-h-[70vh] overflow-auto rounded-2xl border border-stone-200 bg-stone-950 p-3 text-xs text-stone-50">
					{JSON.stringify(schema, null, 2)}
				</pre>
			)}
		</div>
	)
}

