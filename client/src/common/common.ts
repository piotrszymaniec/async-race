import ICar from "./ICar"
function generateName(): string {
  const carPrefixName = [
    'Citroen',
    'Renault',
    'Fiat',
    'Volksvagen',
    'Mercedes',
    'Rolce-Roys',
    'Aston Martin',
    'Suzuki',
    'Deu',
    'Lancia',
    'Hyundai',
    'Honda',
    'Nissan',
    'Mazda',
    'Subaru',
    'Lexus',
    'Polonaz'
  ]

  const carSufixName = [
    'Sedan',
    'Toro',
    'Viper',
    'Fire',
    'Indiana',
    'Focus',
    'GT',
    'Sport',
    'Turbo',
    'Combi',
    'Impreza',
    'Gold',
    'Gamma',
    'Alfa',
    'Sigma',
    'Silver',
    'Omega'
  ]
  return `${carPrefixName[Math.floor(Math.random() * carPrefixName.length)]} ${carSufixName[Math.floor(Math.random() * carSufixName.length)]}`
}
function generateColor(): string {
  let color = `#${Math.pow(Math.floor(Math.random() * 255), 3).toString(16)}`
  while (color.length < 7) {
    color += '0'
  }
  return color
}

export default function generateCars(): Array<ICar> {
  const arr: Array<ICar> = []
  for (let i = 0; i < 100; i++) {
    arr.push({ name: generateName(), color: generateColor() })
  }
  return arr
}