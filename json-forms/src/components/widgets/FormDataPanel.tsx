type Props = {
	liveFormData: unknown
	submittedFormData: unknown
}

function stringifySafe(value: unknown): string {
	try {
		return JSON.stringify(value ?? null, null, 2)
	} catch {
		return '<<Unable to stringify formData>>'
	}
}

export default function FormDataPanel({ liveFormData, submittedFormData }: Props) {
	return (
		<div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
			<div className="flex items-center justify-between gap-3">
				<h2 className="text-sm font-extrabold tracking-tight text-slate-900">formData</h2>
			</div>

			<div className="mt-3 grid gap-3">
				<div>
					<div className="text-xs font-semibold text-slate-600">Live (as you type)</div>
					<pre className="mt-2 max-h-[30vh] overflow-auto rounded-2xl border border-slate-200 bg-slate-950 p-3 text-xs text-slate-50">
						{stringifySafe(liveFormData)}
					</pre>
				</div>

				<div>
					<div className="text-xs font-semibold text-slate-600">Last submitted</div>
					<pre className="mt-2 max-h-[30vh] overflow-auto rounded-2xl border border-slate-200 bg-slate-950 p-3 text-xs text-slate-50">
						{stringifySafe(submittedFormData)}
					</pre>
				</div>
			</div>
		</div>
	)
}
