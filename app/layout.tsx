import '../app/[locale]/globals.css';
import { ClerkProviderWrapper } from '../components/providers/ClerkProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <ClerkProviderWrapper>{children}</ClerkProviderWrapper>
      </body>
    </html>
  );
}
