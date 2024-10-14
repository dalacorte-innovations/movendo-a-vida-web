export const formatCpfDisplay = (cpf) => {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return cpf;
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };
  
export const removeCpfFormatting = (cpf) => {
  return cpf.replace(/\D/g, '');
};
  
export const formatCnpjDisplay = (cnpj) => {
  cnpj = cnpj.replace(/\D/g, '');
  if (cnpj.length !== 14) return cnpj;
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};
  
export const removeCnpjFormatting = (cnpj) => {
  return cnpj.replace(/\D/g, '');
};
  