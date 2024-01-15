export function isValidEmail(value) {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(value);
}

export function isValidPassword(value, type = 'all') {
  const regex = {
    all: /(?=[A-Za-z0-9`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]+$)^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])(?=.{8,32}).*$/,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/,
    special: /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/,
    length: /.{8,32}/,
  };

  return regex[type].test(value);
}

export function isValidHexColor(value) {
  const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return regex.test(value);
}

export function isValidUsername(value) {
  const regex = /^(?!_)(?!.*_$)[A-Za-z0-9_]{3,20}$/;
  return regex.test(value);
}

export function isValidName(value) {
  const regex = /^(?!.*\s\s)[a-zA-Z‘’'-\s]*$/;
  return regex.test(value);
}
