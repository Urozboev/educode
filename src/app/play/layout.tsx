/**
 * O'yin sahifasi ataylab alohida layout'da: o'qituvchi darsda proyektorda
 * ochganda yon menyu va navbat chalg'itmasligi kerak.
 */
export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen px-4 py-8 sm:py-12">
      {children}
    </main>
  );
}
