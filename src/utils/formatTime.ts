export default function (inputSeconds: number, complete: boolean = false) {
    const days = Math.floor(inputSeconds / (60 * 60 * 24))
    const hours = Math.floor((inputSeconds % (60 * 60 * 24)) / (60 * 60))
    const minutes = Math.floor(((inputSeconds % (60 * 60 * 24)) % (60 * 60)) / 60)
    const seconds = Math.floor(((inputSeconds % (60 * 60 * 24)) % (60 * 60)) % 60)
    let ddhhmmss = ''
    if (days > 0) ddhhmmss += days + (!complete ? 'd ' : days === 1 ? ' Día ' : ' Días ')
    if (hours > 0) ddhhmmss += hours + (!complete ? 'h ' : hours === 1 ? ' Hora ' : ' Horas ')
    if (minutes > 0) ddhhmmss += minutes + (!complete ? 'm ' : minutes === 1 ? ' Minuto ' : ' Minutos ')
    if (seconds > 0) ddhhmmss += seconds + (!complete ? 's ' : seconds === 1 ? ' Segundo ' : ' Segundos ')
    return ddhhmmss
}
