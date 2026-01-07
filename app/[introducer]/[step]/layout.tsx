export default function StepLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
      <script src="https://webservices.data-8.co.uk/javascript/address_min.js"></script>
      {children}
    </>
  )
}
