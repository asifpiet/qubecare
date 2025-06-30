import { isEmpty, isEmptyArray, isNullOrUndefined } from './helpers';

// 👉 Required Validator
export const requiredValidator = value => {
  if (isNullOrUndefined(value) || isEmptyArray(value) || value === false)
    return 'This field is required'

  return !!String(value).trim().length || 'This field is required'
}

export const passcodeValidator = (value) => {
  return value && /^\d{8}$/.test(value)
    ? true
    : "The passcode must be 8 digits.";
};
export const verificationCodeValidator = (value) => {
  return value && /^\d{6}$/.test(value)
    ? true
    : "The passcode must be 6 digits.";
};


export const requiredFieldValidator = value =>
  value === 'Yes' || value === 'No' ? true : 'Please select Yes or No';

export const setPasswordValidator = (value) => {
  const isValid =
    value &&
    /[A-Za-z]/.test(value) &&                    // At least one letter
    /\d/.test(value) &&                          // At least one digit
    /[!@#$%^&*(),.?":{}|<>]/.test(value);        // At least one special character

  return isValid
    ? true
    : "Password must be include at least one letter, one number, and one special character.";
};



// 👉 Email Validator
export const emailValidator = value => {
  if (isEmpty(value))
    return true
  const re = /^(?:[^<>()[\]\\.,;:\s@"]+(?:\.[^<>()[\]\\.,;:\s@"]+)*|".+")@(?:\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]|(?:[a-z\-\d]+\.)+[a-z]{2,})$/i
  if (Array.isArray(value))
    return value.every(val => re.test(String(val))) || 'The Email field must be a valid email'

  return re.test(String(value)) || 'The Email field must be a valid email'
}

// 👉 Password Validator
export const passwordValidator = password => {
  const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/
  const validPassword = regExp.test(password)

  return validPassword || 'Field must contain at least one uppercase, lowercase, special character and digit with min 8 chars'
}
export const requiredFirstName = value => {
  if (isNullOrUndefined(value) || isEmptyArray(value) || value === false)
    return 'First Name field is required'

  if (!String(value).trim().length)
    return 'First Name is required'

  // Check if the name contains only alphabetic characters and spaces
  const alphaRegex = /^[A-Za-z\s]+$/
  if (!alphaRegex.test(String(value).trim()))
    return 'First Name must contain only alphabetic characters'

  return true
}
export const requiredName = value => {
  if (isNullOrUndefined(value) || isEmptyArray(value) || value === false)
    return 'Name field is required'

  return !!String(value).trim().length || 'Name is required'
}
export const requiredEmail = value => {
  if (isNullOrUndefined(value) || isEmptyArray(value) || value === false)
    return 'Email field is required'

  return !!String(value).trim().length || 'Email is required'
}
export const requiredLastName = value => {
  if (isNullOrUndefined(value) || isEmptyArray(value) || value === false)
    return 'Last Name field is required'

  if (!String(value).trim().length)
    return 'Last Name is required'

  // Check if the name contains only alphabetic characters and spaces
  const alphaRegex = /^[A-Za-z\s]+$/
  if (!alphaRegex.test(String(value).trim()))
    return 'Last Name must contain only alphabetic characters'

  return true
}
// 👉 Confirm Password Validator
export const confirmedValidator = (value, target) => value === target || 'The Confirm Password field confirmation does not match'

// 👉 Between Validator
export const betweenValidator = (value, min, max) => {
  const valueAsNumber = Number(value)

  return (Number(min) <= valueAsNumber && Number(max) >= valueAsNumber) || `Enter number between ${min} and ${max}`
}

export const alphabeticValidator = value => {
  const regex = /^[A-Za-z\s]+$/;
  return regex.test(value) || 'Field must contain only alphabetic characters';
};

export const validUSAPhone = value => {
  if (isEmpty(value))
    return true
  const valueAsString = String(value)

  return /^\(\d{3}\)\s\d{3}-\d{4}$/i.test(valueAsString) || 'Enter a valid phone number'
};

export const positiveIntegerValidator = value =>
  value >= 0 || 'Negative ID are not allowed.';

export const validateNpiNumber = value => {
  if (isEmpty(value)) {

    return true; // Or return an empty string based on your preference  
  }

  // Check for validity  
  const isValidLength = value.length >= 10 && value.length <= 15;
  const isNumeric = /^[0-9]+$/.test(value); // Only numbers  

  if (!isValidLength) {
    return 'NPI Number must be between 10 and 15 characters long.';
    return false; // Return false on error (or an error message if you prefer)  
  } else if (!isNumeric) {
    return 'NPI Number must be numeric.';
    return false; // Return false on error  
  } else {

    return true; // Return true if valid  
  }
};
export const validUSAPhoneADD = value => {
  if (isEmpty(value)) return true;

  const valueAsString = String(value);

  // Update the regex to match the desired format XXX-XXX-XXXX  
  return /^\d{3}-\d{3}-\d{4}$/.test(valueAsString) || 'Phone is not valid';
};
export const cardNumberValidator = value => {
  // Adjust the regex based on your credit card number pattern
  const cardNumberPattern = /^(\d{15}|\d{16})$/;

  return cardNumberPattern.test(value) || 'Invalid credit card number';
};

export const expiryValidator = value => {
  // Check if the format is MM/YY
  const formatRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!formatRegex.test(value)) {
    return 'Invalid date format. Please use MM/YY';
  }

  // Check if the date is not expired (assuming the current date is 01/24 for example)
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  const [inputMonth, inputYear] = value.split('/').map(Number);

  if (inputYear < currentYear || (inputYear === currentYear && inputMonth < currentMonth)) {
    return 'The card has expired';
  }

  return true;
}
export const cvvValidator = value => {
  return /^\d{3}$/.test(value) || 'Must be a 3-digit number';
}

export const alphaNumericValidator = v =>
  /^[a-zA-Z0-9]+$/.test(v) || 'Only letters and numbers are allowed (no + or -)';

// 👉 Integer Validator
export const integerValidator = value => {
  if (isEmpty(value))
    return true
  if (Array.isArray(value))
    return value.every(val => /^-?\d+$/.test(String(val))) || 'This field must be an integer'

  return /^-?\d+$/.test(String(value)) || 'This field must be an integer'
}

// 👉 Regex Validator
export const regexValidator = (value, regex) => {
  if (isEmpty(value))
    return true
  let regeX = regex
  if (typeof regeX === 'string')
    regeX = new RegExp(regeX)
  if (Array.isArray(value))
    return value.every(val => regexValidator(val, regeX))

  return regeX.test(String(value)) || 'The Regex field format is invalid'
}

// 👉 Alpha Validator
export const alphaValidator = value => {
  if (isEmpty(value))
    return true

  return /^[A-Z]*$/i.test(String(value)) || 'The Alpha field may only contain alphabetic characters'
}

// 👉 URL Validator
export const urlValidator = value => {
  if (isEmpty(value))
    return true
  const re = /^https?:\/\/[^\s$.?#].\S*$/

  return re.test(String(value)) || 'URL is invalid'
}

// 👉 Length Validator
export const lengthValidator = (value, length) => {
  if (isEmpty(value))
    return true

  return String(value).length === length || `"The length of the Characters field must be ${length} characters."`
}

// 👉 Alpha-dash Validator
export const alphaDashValidator = value => {
  if (isEmpty(value))
    return true
  const valueAsString = String(value)

  return /^[\w-]*$/.test(valueAsString) || 'All Character are not valid'
}
export const validatePrice = () => {
  // Clear previous error  
  priceError.value = '';

  // Check if the price is empty or not a valid number  
  if (price.value === '') {
    return 'Price is required.';
  } else if (isNaN(price.value) || !isFinite(price.value)) {
    return 'Price must be a valid number.';
  } else if (parseFloat(price.value) < 0) {
    return 'Price cannot be negative.';
  }
};  
