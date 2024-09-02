import AuthLayout from '#components/layouts/auth_layout'
import { Button } from '#components/ui/components/ui/button'
import { Input } from '#components/ui/components/ui/input'
import { Label } from '#components/ui/components/ui/label'
import { GithubIcon } from 'lucide-react'

function Register() {
  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex-1 flex flex-col gap-4">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
          Login to your account
        </h2>
        <form
          onSubmit={() => {}}
          method="POST"
          className="mt-8 space-y-6 flex flex-col justify-center items-center"
        >
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              placeholder="Email"
              className="mt-1"
              name="email"
              onChange={(e) => console.log(e.target.value)}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              placeholder="Password"
              className="mt-1"
              name="password"
              onChange={(e) => console.log(e.target.value)}
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
        <div className="mt-2 text-center text-sm text-muted-foreground flex flex-col gap-2 px-4 justify-center items-center">
          <span className="text-sm font-medium">Or</span>
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
        </div>
      </div>
    </div>
  )
}

Register.layout = (page: any) => <AuthLayout>{page}</AuthLayout>
export default Register
