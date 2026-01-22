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
		<div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.85)] backdrop-blur-xl">
			<div className="flex items-center justify-between gap-3">
				<h2 className="text-sm font-extrabold tracking-tight text-slate-50">formData</h2>
			</div>

			<div className="mt-3 grid gap-3">
				<div>
					<div className="text-xs font-semibold text-slate-300">Live (as you type)</div>
					<pre className="mt-2 max-h-[30vh] overflow-auto rounded-2xl border border-white/10 bg-slate-950/50 p-3 text-xs text-slate-100">
						{stringifySafe(liveFormData)}
					</pre>
				</div>

				<div>
					<div className="text-xs font-semibold text-slate-300">Last submitted</div>
					<pre className="mt-2 max-h-[30vh] overflow-auto rounded-2xl border border-white/10 bg-slate-950/50 p-3 text-xs text-slate-100">
						{stringifySafe(submittedFormData)}
					</pre>
				</div>
			</div>
		</div>
	)
}
