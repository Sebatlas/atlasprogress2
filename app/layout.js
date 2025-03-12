export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <title>Atlas AI Dashboard</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
