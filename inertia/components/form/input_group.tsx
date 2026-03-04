import { Input } from '#components/ui/input'
import { Label } from '#components/ui/label'

interface InputGroupProps {
  label: string
  inputName: string
  type: string
  formData: any
  setFormData: any
}

function InputGroup({ label, inputName, type, formData, setFormData }: InputGroupProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }))
  }

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={inputName}>{label}</Label>
      <Input
        type={type}
        placeholder={label}
        className="mt-1"
        name={inputName}
        value={formData[inputName as keyof typeof formData]}
        onChange={handleInputChange}
      />
    </div>
  )
}

export default InputGroup
