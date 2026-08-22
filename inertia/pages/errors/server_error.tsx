export default function ServerError(props: { error: any }) {
  return (
    <>
      <div className="container">
        <div className="title">Erreur serveur</div>

        <span>Une erreur interne est survenue. Notre équipe a été alertée. Veuillez réessayer plus tard.</span>
      </div>
    </>
  )
}