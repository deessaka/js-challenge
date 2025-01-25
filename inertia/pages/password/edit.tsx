import InputGroup from '#components/form/input_group'
import BaseLayout from '#components/layouts/base_layout'
import { Button } from '#components/ui/components/ui/button'
import { router, useForm } from '@inertiajs/react'
import { Label } from '@radix-ui/react-label'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'

function EditPassword() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })

  const { post, processing, errors, data } = useForm(formData)

  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post('/password/set', {
      data,
      onSuccess: () => {
        alert('Password updated successfully')
        router.get('home')
      },
      onError: () => {
        console.log('error', errors)
        alert('Something went wrong')
      },
    })
  }

  const handleShowPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target
    setShowPassword(checked)
  }
  return (
    <div className="flex flex-col items-start justify-stretch gap-4 p-4 w-full">
      <Button onClick={() => router.get('/')} variant="outline" className="flex items-center">
        <ArrowLeft size={24} />
        <span className="ml-2">Retour</span>
      </Button>

      <div className="flex flex-col gap-4 p-4 flex-1">
        <h1 className="text-3xl font-bold">Entre ton mot de passe</h1>
        <p className="text-sm text-muted-foreground">
          Pour changer ton mot de passe, entre ton ancien et ton nouveau.
        </p>
        <form onSubmit={handleSubmit} method="post" className="flex flex-col gap-4">
          <InputGroup
            formData={formData}
            setFormData={setFormData}
            label="mot de passe"
            inputName="password"
            {...(showPassword
              ? {
                type: 'text',
              }
              : {
                type: 'password',
              })}
          />
          <InputGroup
            formData={formData}
            setFormData={setFormData}
            label="Confirmez le mot de passe"
            inputName="confirmPassword"
            {...(showPassword
              ? {
                type: 'text',
              }
              : {
                type: 'password',
              })}
          />
          <div className="flex items-center gap-2">
            <input type="checkbox" onChange={handleShowPasswordChange} className="h-4 w-4" />
            <Label htmlFor="showPassword">Afficher le mot de passe</Label>
          </div>
          <Button type="submit" variant="secondary">
            {processing ? 'En cours...' : 'Definir le mot de passe'}
          </Button>
        </form>
      </div>
    </div>
  )
}

EditPassword.layout = (page: any) => <BaseLayout>{page}</BaseLayout>

export default EditPassword
