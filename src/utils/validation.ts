export function validateDNI(dni: string): boolean {
  const dniRegex = /^[0-9]{8}[A-Z]$/;
  const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;
  
  if (!dniRegex.test(dni) && !nieRegex.test(dni)) {
    return false;
  }

  const validLetters = "TRWAGMYFPDXBNJZSQVHLCKE";
  let number = dni.slice(0, 8);
  
  if (nieRegex.test(dni)) {
    const firstLetter = dni.charAt(0);
    number = dni.slice(1, 8);
    if (firstLetter === 'X') number = '0' + number;
    else if (firstLetter === 'Y') number = '1' + number;
    else if (firstLetter === 'Z') number = '2' + number;
  }
  
  const letter = dni.charAt(8);
  const calculatedLetter = validLetters.charAt(parseInt(number) % 23);
  
  return letter === calculatedLetter;
}