import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background elements */}
      <div className="gradient-blur">
        <div className="blur-circle w-96 h-96 bg-primary -top-20 -left-20" />
        <div className="blur-circle w-96 h-96 bg-secondary top-1/2 -right-20" />
      </div>

      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/90s-anime-aesthetic-wric2do30b1rjds3-jGhRM5hzm2EZ2yXNKHDJxGEe08pYpU.jpg)",
          opacity: 0.1,
        }}
      />

      <div className="glass-card p-8 w-full max-w-md">
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-transparent shadow-none",
              headerTitle: "text-foreground",
              headerSubtitle: "text-foreground/70",
              socialButtonsBlockButton: "border-primary/50 text-foreground hover:bg-white/10",
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
              formFieldInput: "glass-input",
              footerActionLink: "text-primary hover:text-primary/80",
            },
          }}
        />
      </div>
    </main>
  )
}
