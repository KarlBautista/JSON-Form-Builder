import Form from '@rjsf/mui'
import type { RJSFSchema } from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'

type Props = {
	schema: RJSFSchema
}

export default function DynamicForm({ schema }: Props) {
	return <Form schema={schema} validator={validator} onSubmit={({ formData }) => console.log(formData)} />
}
