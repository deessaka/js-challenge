import { useState } from 'react'
import AuthLayout from '#components/layouts/auth_layout'
import { Button } from '#components/ui/components/ui/button'
import { Input } from '#components/ui/components/ui/input'
import { Label } from '#components/ui/components/ui/label'
import { GithubIcon } from 'lucide-react'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log('Form submitted:', formData)
  }

  const renderInput = (label: string, name: string, type: string) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input
        type={type}
        placeholder={label}
        className="mt-1"
        name={name}
        value={formData[name as keyof typeof formData]}
        onChange={handleInputChange}
      />
    </div>
  )

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 border-t border-b border-foreground rounded-lg shadow-sm shadow-black">
      <div className="text-center text-sm text-muted-foreground flex flex-col gap-4 px-4 justify-center items-center">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
          Login with
        </h2>
        <form
          action="/oauth/github/redirect"
          method="GET"
          className="flex items-center justify-center gap-4 mt-2"
        >
          <Button
            type="submit"
            className="flex items-center justify-center gap-4 font-medium px-4 py-2 rounded-lg text-gray-50 bg-gray-800 hover:bg-gray-900/75 dark:bg-secondary-foreground dark:hover:bg-secondary-foreground/75 dark:text-gray-900"
          >
            <GithubIcon size={24} />
            sign in with Github
          </Button>
        </form>
        <span className="text-sm font-medium">Or use your email</span>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex-1 flex flex-col gap-4">
        <form
          onSubmit={handleSubmit}
          method="POST"
          className="mt-8 space-y-6 flex flex-col justify-center items-center"
        >
          {renderInput('Email', 'email', 'email')}
          {renderInput('Password', 'password', 'password')}
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </div>
  )
}

Login.layout = (page: any) => <AuthLayout>{page}</AuthLayout>
export default Login
