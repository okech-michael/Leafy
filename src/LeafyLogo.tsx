import officialLogo from './assets/officialogo.png'

export function LeafyLogo({ className }: { className: string }) {
  return <img src={officialLogo} alt="Leafy logo" className={`object-contain ${className}`} />
}
