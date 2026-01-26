import { useState, useEffect } from 'react'

type Props = {
	liveFormData: unknown
	submittedFormData: unknown
	onFormDataChange?: (data: unknown) => void
}

function stringifySafe(value: unknown): string {
	try {
		return JSON.stringify(value ?? null, null, 2)
	} catch {
		return '<<Unable to stringify formData>>'
	}
}

export default function FormDataPanel({ liveFormData, submittedFormData, onFormDataChange }: Props) {
	const [isEditing, setIsEditing] = useState(false)
	const [formDataText, setFormDataText] = useState('')
	const [parseError, setParseError] = useState<string | null>(null)

	useEffect(() => {
		if (!isEditing) {
			setFormDataText(stringifySafe(liveFormData))
		}
	}, [liveFormData, isEditing])

	const handleApply = () => {
		try {
			const parsed = JSON.parse(formDataText)
			setParseError(null)
			onFormDataChange?.(parsed)
			setIsEditing(false)
		} catch (e) {
			setParseError(e instanceof Error ? e.message : 'Invalid JSON')
		}
	}
	return (
		<div className="rounded-[1.5rem] bg-white p-5 shadow-lg shadow-slate-200/50 ring-1 ring-slate-100">
			<div className="flex items-center justify-between gap-3 mb-3">
				<h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Form Data</h2>
				{onFormDataChange && (
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

			{parseError && (
				<div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
					<div className="font-semibold">Parse Error</div>
					<div className="mt-1">{parseError}</div>
				</div>
			)}

			<div className="mt-3 grid gap-3">
				<div>
					<div className="text-xs font-semibold text-stone-600">Live (as you type)</div>
					{isEditing ? (
						<textarea
							value={formDataText}
							onChange={(e) => setFormDataText(e.target.value)}
							className="mt-2 max-h-[30vh] w-full overflow-auto rounded-2xl border border-stone-200 bg-stone-950 p-3 font-mono text-xs text-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
							rows={12}
						/>
					) : (
						<pre className="mt-2 max-h-[30vh] overflow-auto rounded-2xl border border-stone-200 bg-stone-950 p-3 text-xs text-stone-50">
							{stringifySafe(liveFormData)}
						</pre>
					)}
				</div>

				<div>
					<div className="text-xs font-semibold text-stone-600">Last submitted</div>
					<pre className="mt-2 max-h-[30vh] overflow-auto rounded-2xl border border-stone-200 bg-stone-950 p-3 text-xs text-stone-50">
						{stringifySafe(submittedFormData)}
					</pre>
				</div>
			</div>
		</div>
	)
}

