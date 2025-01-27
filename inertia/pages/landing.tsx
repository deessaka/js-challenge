import { ChallengeSection } from '#components/landing/ChallengeSection'
import { FeaturesSection } from '#components/landing/FeaturesSection'
import { MethodSection } from '#components/landing/MethodSection'
import BaseLayout from '#components/layouts/base_layout'
import { containerVariants, itemVariants } from '#components/landing/constants'
export default function Landing() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section d'Appel à l'Action Rétro */}
      <ChallengeSection containerVariants={containerVariants} itemVariants={itemVariants} />

      {/* Hero Section */}
      {/* <HeroSection containerVariants={containerVariants} itemVariants={itemVariants} /> */}

      {/* Features Section */}
      <FeaturesSection containerVariants={containerVariants} itemVariants={itemVariants} />

      {/* Section d'Appel à l'Action */}
      <MethodSection containerVariants={containerVariants} itemVariants={itemVariants} />
    </div>
  )
}

Landing.layout = (page: any) => <BaseLayout>{page}</BaseLayout>
