"use strict";

const API_URL = "https://carparking-1es7.onrender.com";

let isAdmin = false;

const openModalPrice = () => {
  if (isAdmin) {
    document.querySelector("#umaHoraPreco").disabled = false;
    document.querySelector("#precoAteUmaHora").disabled = false;
    document.querySelector("#salvarPreco").disabled = false;
  } else {
    document.querySelector("#umaHoraPreco").disabled = true;
    document.querySelector("#precoAteUmaHora").disabled = true;
    document.querySelector("#salvarPreco").disabled = true;
  }
  document.querySelector("#modalPreco").classList.add("active");
};

const openModalEditPrice = () =>
  document.querySelector("#modalEditar").classList.add("active");

const openModalProof = () =>
  document.querySelector("#modalComprovante").classList.add("active");

const executeAnimate = () =>
  document.querySelector("#relatorioPagamento").classList.add("animate");

const executeAnimateTableClient = () =>
  document
    .querySelector("#tabelaClientesQueNaoPagaram")
    .classList.add("animate");

const removeAnimate = () =>
  document.querySelector("#relatorioPagamento").classList.remove("animate");

const removeAnimateTableClient = () =>
  document
    .querySelector("#tabelaClientesQueNaoPagaram")
    .classList.remove("animate");

const openPaymentReportTab = () => {
  document.querySelector("#relatorioPagamento").classList.remove("displayNome");
  document.querySelector("#abaRelatorioPagamento").classList.add("ativoAba");
  document.querySelector("#abaTabelaClientes").classList.remove("ativoAba");
  setTimeout(executeAnimate, 500);
  removeAnimateTableClient();
};

const openCustomersTable = () => {
  document
    .querySelector("#tabelaClientesQueNaoPagaram")
    .classList.remove("displayNome");
  document.querySelector("#abaTabelaClientes").classList.add("ativoAba");
  document.querySelector("#abaRelatorioPagamento").classList.remove("ativoAba");
  setTimeout(executeAnimateTableClient, 500);
};

const modalVouchers = () =>
  document
    .querySelector("#modalEscolhaDeComprovante")
    .classList.remove("active");

const closeModalVoucherEntry = () =>
  document.querySelector("#modalComprovanteEntrada").classList.remove("active");

const closeModalPrice = () =>
  document.querySelector("#modalPreco").classList.remove("active");

const closeModalEditData = () =>
  document.querySelector("#modalEditar").classList.remove("active");

const closeModalProof = () =>
  document.querySelector("#modalComprovante").classList.remove("active");

const closeComprovante = () =>
  document.querySelector("#modalComprovante").classList.remove("active");

const closeChoiceVoucher = () =>
  document
    .querySelector("#modalEscolhaDeComprovante")
    .classList.remove("active");

const closeTabCustomersTable = () =>
  document
    .querySelector("#tabelaClientesQueNaoPagaram")
    .classList.add("displayNome");

const closePayersReport = () => {
  document.querySelector("#relatorioPagamento").classList.add("displayNome");
  removeAnimate();
};

const cancelVoucherEntry = () => {
  const reasonToDelete = prompt(`Por qual motivo deseja deletar?`);
  const resp = confirm(`Confirma que o motivo da exclusão é ${reasonToDelete}`);

  if (resp) {
    const db = readDB();
    db.pop();
    setDB(db);
  }

  document.querySelector("#modalComprovanteEntrada").classList.remove("active");
  updateTable();
};

const readDB = () => JSON.parse(localStorage.getItem("bank")) ?? [];

const setDB = (bank) => localStorage.setItem("bank", JSON.stringify(bank));

//const readDBPrice = () => JSON.parse(localStorage.getItem("bankPrice")) ?? [];

//const setDBPrice = (bankPrice) =>
//  localStorage.setItem("bankPrice", JSON.stringify(bankPrice));

const getPrices = async () => {
  try {
    const response = await fetch(`${API_URL}/getPrices`);
    if (response.ok) {
      const prices = await response.json();
      console.log(prices);
      document.querySelector("#umaHoraPreco").value = prices.Hora;
      document.querySelector("#precoAteUmaHora").value = prices.HoraExtra;
    } else {
      console.error("Erro ao obter preços");
    }
  } catch (err) {
    console.error("Erro de rede:", err);
  }
};

const updatePrices = async () => {
  const hourlyRate = document.querySelector("#umaHoraPreco").value;
  const additionalHourlyRate = document.querySelector("#precoAteUmaHora").value;

  try {
    const response = await fetch(`${API_URL}/updatePrices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Hora: hourlyRate,
        HoraExtra: additionalHourlyRate,
      }),
    });

    if (response.ok) {
      alert("Preços atualizados com sucesso");
    } else {
      console.error("Erro ao atualizar preços");
    }
  } catch (err) {
    console.error("Erro de rede:", err);
  }
};

document.querySelector("#salvarPreco").addEventListener("click", updatePrices);

// Chame getPrices quando a página carregar para preencher os campos de preço
getPrices();

const insertDB = (dadosCadastro) => {
  const bank = readDB();
  bank.push(dadosCadastro);
  setDB(bank);
};

const insertDBPrice = (registrationPrice) => {
  const bankPrice = readDBPrice();
  bankPrice.push(registrationPrice);
  setDBPrice(bankPrice);
};

const updateClient = () => {
  const updatedData = {
    id: document.querySelector("#nomeEditar").dataset.index,
    name: document.querySelector("#nomeEditar").value,
    hescores: document.querySelector("#placaEditar").value,
    date: document.querySelector("#dataEditar").value,
    exitdate: "",
    time: document.querySelector("#horaEditar").value,
    departureTime: "",
    status: "Não pago",
    amountToPay: "",
  };

  const index = document.querySelector("#nomeEditar").dataset.index;

  const db = readDB();
  db[index] = updatedData;
  setDB(db);

  closeModalEditData();
  updateTable();
};

const createRegistration = (dadosCadastro) => {
  const cadastro = document.createElement("tr");
  cadastro.innerHTML = `  
    <td>${dadosCadastro.name}</td>
    <td>${dadosCadastro.hescores}</td>
    <td>${dadosCadastro.date}</td>
    <td>${dadosCadastro.time}</td>
    <td>
        <button type="button" id="btnComprovanteIndex" class="btnVerde" data-action="comprovante-${dadosCadastro.id}" >Comprovantes</button>
        <button type="button" class="btnAmarelo" data-action="editar-${dadosCadastro.id}">Editar</button>
        <button type="button" class="btnExcluir" data-action="deletar-${dadosCadastro.id}">Excluir</button>
    </td>`;

  document.getElementById("tbody").appendChild(cadastro);
};

const clearTable = () => {
  const tabelaClientes = document.querySelector("#tbody");
  while (tabelaClientes.firstChild) {
    tabelaClientes.removeChild(tabelaClientes.lastChild);
  }
};

const updateTable = () => {
  const bank = readDB();
  clearTable();
  const customersWhoDidNotPay = bank.filter(
    (bank) => bank.status == "Não pago"
  );
  customersWhoDidNotPay.forEach(createRegistration);
};

const date = () => {
  let date = new Date();
  let morning = String(date.getDate()).padStart(2, "0");
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let year = date.getFullYear();
  let currentDate = morning + "." + month + "." + year;
  return currentDate;
};

const hour = () => {
  let today = new Date();
  let hours = ("00" + today.getHours()).slice(-2);
  let minutes = ("00" + today.getMinutes()).slice(-2);
  let currentTime = hours + ":" + minutes;
  return currentTime;
};

const clearInput = () => {
  document.querySelector("#nome").value = "";
  document.querySelector("#placaDoCarro").value = "";
};

const disableButton = () => {
  document
    .querySelector("#cancelarComprovanteEntrada")
    .classList.add("displayNome");
  document.querySelector("#modalComprovanteEntrada").classList.add("btnDois");
};

const enableButton = () => {
  document
    .querySelector("#cancelarComprovanteEntrada")
    .classList.remove("displayNome");
  document
    .querySelector("#modalComprovanteEntrada")
    .classList.remove("btnDois");
};

const printProofOfEntry = () => {
  closeChoiceVoucher();
  const index = document.querySelector("#btnPagamento").dataset.index;
  const db = readDB();
  const showDiceSelects = [
    db[index].name,
    db[index].hescores,
    db[index].date,
    db[index].time,
  ];
  proofOfEntry(showDiceSelects);
};

const proofOfEntry = (array) => {
  document.querySelector("#nomeComprovanteEntrada").value = array[0];
  document.querySelector("#placaComprovanteEntrada").value = array[1];
  document.querySelector("#dataComprovanteEntrada").value = array[2];
  document.querySelector("#horaComprovanteEntrada").value = array[3];

  document.querySelector("#modalComprovanteEntrada").classList.add("active");
};

const isValidForm = () =>
  document.querySelector(".formCadastro").reportValidity();

const saveClient = async () => {
  // Obtenha os preços do banco de dados
  const response = await fetch(`${API_URL}/getPrices`);
  const dbPrice = response.ok ? await response.json() : null;

  if (isValidForm()) {
    if (!dbPrice || !dbPrice.Hora || !dbPrice.HoraExtra) {
      confirm(
        "Deve ser informado os preços, antes de inserir o primeiro cliente"
      );
      openModalPrice();
    } else {
      const lastId = readDB().length - 1;
      let validId = lastId == -1 ? 0 : parseInt(readDB()[lastId].id) + 1;
      const newClient = {
        id: validId,
        name: document.querySelector("#nome").value,
        hescores: document.querySelector("#placaDoCarro").value,
        date: date(),
        exitdate: "",
        time: hour(),
        departureTime: "",
        status: "Não pago",
        amountToPay: "",
        convenio: null, // Inicialmente null, será atualizado após seleção do convênio
      };
      insertDB(newClient);
    }

    updateTable();

    const db = readDB();
    const lastRecord = db[db.length - 1];
    const showLastRecord = [
      lastRecord.name,
      lastRecord.hescores,
      lastRecord.date,
      lastRecord.time,
    ];

    proofOfEntry(showLastRecord);

    clearInput();
  }
};

const isValidFormPrice = () => document.querySelector(".form").reportValidity();

const savePrice = async () => {
  if (isValidFormPrice()) {
    const price = {
      Hora: document.querySelector("#umaHoraPreco").value,
      HoraExtra: document.querySelector("#precoAteUmaHora").value,
    };

    try {
      const response = await fetch(`${API_URL}/updatePrices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(price),
      });

      if (response.ok) {
        alert("Preços atualizados com sucesso");
        closeModalPrice();
      } else {
        console.error("Erro ao atualizar preços");
      }
    } catch (err) {
      console.error("Erro de rede:", err);
    }
  }
};

document.querySelector("#salvarPreco").addEventListener("click", savePrice);

// Chame getPrices quando a página carregar para preencher os campos de preço
window.onload = getPrices;

const applyNumericMask = (number) => {
  number = number.replace(/\D/g, "");
  number = number.replace(/(\d{1})(\d{5})$/, "$1.$2");
  number = number.replace(/(\d{1})(\d{1,2})$/, "$1,$2");
  return number;
};

const applyCarMask = (carPlate) => {
  carPlate = carPlate.replace(/[^a-zA-Z0-9]/, "");
  carPlate = carPlate.replace(/(.{3})(.)/, "$1-$2");
  return carPlate;
};

const applyMask = (event) => {
  event.target.value = applyNumericMask(event.target.value);
};

const applyMaskCar = (event) => {
  event.target.value = applyCarMask(event.target.value);
};

const deleteClient = (index) => {
  const db = readDB();
  const reasonToDelete = prompt(
    `Por qual motivo deseja deletar ${db[index].name}?`
  );
  const resp =
    reasonToDelete == ""
      ? alert("Informe um motivo!")
      : confirm(`Confirma que o motivo da exclusão é ${reasonToDelete}`);
  if (resp) {
    db.splice(index, 1);
    setDB(db);
    updateTable();
  }
};

const editClient = (index) => {
  const db = readDB();
  document.querySelector("#nomeEditar").value = db[index].name;
  document.querySelector("#placaEditar").value = db[index].hescores;
  document.querySelector("#dataEditar").value = db[index].date;
  document.querySelector("#horaEditar").value = db[index].time;
  document.querySelector("#nomeEditar").dataset.index = index;
  openModalEditPrice();
};

const printOutProof = async () => {
  openModalConvenio();
};

const modalVoucherChoice = (index) => {
  document.querySelector("#modalEscolhaDeComprovante").classList.add("active");
  document.querySelector("#btnPagamento").dataset.index = index;
};

/*const showModalPrice = () => {
  const dbPrice = readDBPrice();

  document.querySelector("#umaHoraPreco").value = dbPrice[0].onehourPrice;
  document.querySelector("#precoAteUmaHora").value = dbPrice[0].otherHoursPrice;
};*/

const showModalPrice = () => {
  getPrices(); // Chame a função getPrices para preencher os campos de preço
  document.querySelector("#modalPreco").classList.add("active");
};

document.querySelector("#btnSalvarPreco");
// .addEventListener("click", updatePrices);
document.querySelector("#btnMostrarPreco");
//.addEventListener("click", showModalPrice);

const actionButttons = (event) => {
  const element = event.target;
  if (element.type === "button") {
    const action = element.dataset.action.split("-");
    if (action[0] === "deletar") {
      deleteClient(action[1]);
    } else if (action[0] == "editar") {
      editClient(action[1]);
    } else {
      modalVoucherChoice(action[1]);
    }
  }
};

const changeStatus = async () => {
  const resp = confirm("Confirma que o cliente, já realizou o pagamento?");
  if (resp) {
    const saveCustomerWhoPaid = {
      id: document.querySelector("#btnPagamento").dataset.index,
      name: document.querySelector("#nomeComprovante").value,
      hescores: document.querySelector("#placaComprovante").value,
      date: document.querySelector("#dataComprovante").value,
      exitdate: date(),
      time: document.querySelector("#horaComprovante").value,
      departureTime: hour(),
      amountToPay: document.querySelector("#valorPagar").value,
      status: "Pago",
    };

    const index = document.querySelector("#btnPagamento").dataset.index;
    const db = readDB();
    db[index] = saveCustomerWhoPaid;
    setDB(db);

    // Enviar dados para o servidor
    const response = await fetch(`${API_URL}/savePayment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(saveCustomerWhoPaid),
    });

    if (response.ok) {
      const result = await response.text();
      console.log(result);
      alert("Payment saved successfully");
      closeModalProof();
      updateTable();
      clearTableCustomersWhoPaid();
      updateTableCustomersParagram();
    } else {
      const error = await response.text();
      console.error(error);
      alert("Error saving payment");
    }
  }
};

document.querySelector("#btnPago").addEventListener("click", changeStatus);

const registeringCustomersWhoPaid = (dados) => {
  const cadastro = document.createElement("tr");
  cadastro.innerHTML = `  
      <td>${dados.name}</td>
      <td>${dados.hescores}</td>
      <td>${dados.date}</td>
      <td>${dados.exitdate}</td>
      <td>${dados.time}</td>
      <td>${dados.departureTime}</td>
      <td>${dados.amountToPay}</td>
    `;
  document.getElementById("tbodyClienteQuePagaram").appendChild(cadastro);
};

const clearTableCustomersWhoPaid = () => {
  const customersWhoPaidTable = document.querySelector(
    "#tbodyClienteQuePagaram"
  );
  while (customersWhoPaidTable.firstChild) {
    customersWhoPaidTable.removeChild(customersWhoPaidTable.lastChild);
  }
};

const updateTableCustomersParagram = async () => {
  try {
    const response = await fetch(`${API_URL}/getPayments`);
    if (response.ok) {
      const payments = await response.json();
      clearTableCustomersWhoPaid();
      payments.forEach(registeringCustomersWhoPaid);
    } else {
      console.error("Erro ao obter pagamentos");
    }
  } catch (err) {
    console.error("Erro de rede:", err);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  updateTable();
  updateTableCustomersParagram();
});

document
  .getElementById("downloadReport")
  .addEventListener("click", async () => {
    try {
      const response = await fetch(`${API_URL}/downloadPayments`);
      if (response.ok) {
        const payments = await response.json();
        const blob = new Blob([JSON.stringify(payments, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "payments.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        console.error("Erro ao baixar o relatório");
      }
    } catch (err) {
      console.error("Erro de rede:", err);
    }
  });

document.querySelector("#salvarPreco").addEventListener("click", savePrice);

document
  .querySelector("#closeComprovanteEntrada")
  .addEventListener("click", closeModalVoucherEntry);

document
  .querySelector("#fecharModal")
  .addEventListener("click", closeModalVoucherEntry);

document.querySelector("#close").addEventListener("click", closeModalPrice);

document
  .querySelector("#closeEscolhaComprovante")
  .addEventListener("click", closeChoiceVoucher);

document
  .querySelector("#closeComprovante")
  .addEventListener("click", closeComprovante);

document
  .querySelector("#closeEditar")
  .addEventListener("click", closeModalEditData);

document.querySelector("#cancelar").addEventListener("click", closeModalPrice);

document
  .querySelector("#cancelarComprovanteEntrada")
  .addEventListener("click", cancelVoucherEntry);

document
  .querySelector("#cancelarEditarDados")
  .addEventListener("click", closeModalEditData);

document
  .querySelector("#cancelarComprovamte")
  .addEventListener("click", closeModalProof);

document
  .querySelector("#tabelaClientes")
  .addEventListener("click", actionButttons);

document.querySelector("#umaHoraPreco").addEventListener("keyup", applyMask);

document.querySelector("#precoAteUmaHora").addEventListener("keyup", applyMask);

document.querySelector("#placaDoCarro").addEventListener("keyup", applyMaskCar);

document.querySelector("#placaEditar").addEventListener("keyup", applyMaskCar);

const openModalLogin = () => {
  document.querySelector("#modalLogin").classList.add("active");
};

const closeModalLogin = () => {
  document.querySelector("#modalLogin").classList.remove("active");
};

const authenticateUser = async () => {
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;
  console.log(`Authenticating user: ${username}`);

  try {
    const response = await fetch(`${API_URL}/authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    console.log(`Response status: ${response.status}`);
    const result = await response.json();
    console.log(`Authentication result: ${JSON.stringify(result)}`);

    if (result.authenticated) {
      isAdmin = result.role === "ADMIN";
      closeModalLogin();
      openModalPrice();
    } else {
      alert("Usuário ou senha incorretos");
    }
  } catch (err) {
    console.error("Erro de rede:", err);
  }
};

const loadConvenios = async () => {
  try {
    const response = await fetch(`${API_URL}/getConvenios`);
    if (response.ok) {
      const convenios = await response.json();
      const convenioSelect = document.querySelector("#convenioSelect");
      convenios.forEach((convenio) => {
        const option = document.createElement("option");
        option.value = JSON.stringify(convenio);
        option.textContent = convenio.empresa;
        convenioSelect.appendChild(option);
      });
    } else {
      console.error("Erro ao obter convênios");
    }
  } catch (err) {
    console.error("Erro de rede:", err);
  }
};

document.addEventListener("DOMContentLoaded", loadConvenios);

document
  .querySelector("#loginButton")
  .addEventListener("click", authenticateUser);
document
  .querySelector("#cancelLogin")
  .addEventListener("click", closeModalLogin);
document
  .querySelector("#closeLogin")
  .addEventListener("click", closeModalLogin);

document.querySelector("#btnPreco").addEventListener("click", openModalLogin);

document.querySelector("#btnSalvar").addEventListener("click", () => {
  saveClient();
  enableButton();
});

document
  .querySelector("#btnAtualizarCliente")
  .addEventListener("click", updateClient);

document
  .querySelector("#btnComprovanteEntrada")
  .addEventListener("click", () => {
    printProofOfEntry();
    disableButton();
  });

document
  .querySelector("#btnPagamento")
  .addEventListener("click", printOutProof);

document
  .querySelector("#btnImprimirComprovante")
  .addEventListener("click", () => {
    window.print();
  });

document
  .querySelector("#btnImprimirComprovanteEntrada")
  .addEventListener("click", () => {
    window.print();
  });

document.querySelector("#btnPago").addEventListener("click", changeStatus);

document
  .querySelector("#abaRelatorioPagamento")
  .addEventListener("click", () => {
    openPaymentReportTab();
    closeTabCustomersTable();
  });

document.querySelector("#abaTabelaClientes").addEventListener("click", () => {
  openCustomersTable();
  closePayersReport();
});

updateTable();
updateTableCustomersParagram();

const openModalConvenio = () => {
  document.querySelector("#modalConvenio").classList.add("active");
};

const closeModalConvenio = () => {
  document.querySelector("#modalConvenio").classList.remove("active");
};

const confirmConvenio = async () => {
  const selectedOption = document.querySelector("#convenioSelect").value;
  if (!selectedOption) {
    alert("Por favor, selecione um convênio.");
    return;
  }

  const convenio = JSON.parse(selectedOption);
  closeModalConvenio();

  modalVouchers();
  const index = document.querySelector("#btnPagamento").dataset.index;
  const db = readDB();

  if (!db || !db.length) {
    console.error("Banco de dados vazio ou não encontrado");
    return;
  }

  const dados = db[index];
  if (!dados) {
    console.error("Dados não encontrados para o índice fornecido");
    return;
  }

  // Obtenha os preços do banco de dados
  const response = await fetch(`${API_URL}/getPrices`);
  const dbPrice = response.ok ? await response.json() : null;

  if (!dbPrice || !dbPrice.Hora || !dbPrice.HoraExtra) {
    alert(
      "Os preços não estão definidos. Por favor, defina os preços primeiro."
    );
    openModalPrice();
    return;
  }

  document.querySelector("#nomeComprovante").value = dados.name;
  document.querySelector("#placaComprovante").value = dados.hescores;
  document.querySelector("#dataComprovante").value = dados.date;
  const time = (document.querySelector("#horaComprovante").value = dados.time);
  document.querySelector("#dataComprovanteSaida").value = date();
  document.querySelector("#horaComprovanteSaida").value = hour();

  // Transformar a hora e minutos da chegada em segundos
  const hoursArrivel = parseInt(time.substr(0, 2)) * 3600;
  const minutesArrivel = parseInt(time.substr(3, 4)) * 60;

  // Transformar a hora e minutos de saída em segundos
  const departureHours = parseInt(hour().substr(0, 2)) * 3600;
  const outgoingMinutes = parseInt(hour().substr(3, 4)) * 60;

  // Segundos de saída menos segundos de entrada
  const secondsOfArriveMinusSecondOfExit =
    departureHours + outgoingMinutes - (hoursArrivel + minutesArrivel);

  // Quantidade de horas que fica estacionado
  const numberOfHoursThatAreParked = secondsOfArriveMinusSecondOfExit / 3600;

  let totalPrice;
  if (numberOfHoursThatAreParked <= 1) {
    totalPrice = parseFloat(dbPrice.Hora.replace(",", "."));
  } else {
    const onehourPrice = parseFloat(dbPrice.Hora.replace(",", "."));
    const otherHoursPrice = parseFloat(dbPrice.HoraExtra.replace(",", "."));
    totalPrice =
      otherHoursPrice * Math.trunc(numberOfHoursThatAreParked) + onehourPrice;
  }

  // Aplicar desconto
  const discount = convenio.desconto / 100;
  const discountedPrice = totalPrice * (1 - discount);

  document.querySelector("#valorPagar").value =
    "R$ " + discountedPrice.toFixed(2);

  // Adicionar campo convenio aos dados
  dados.convenio = {
    empresa: convenio.empresa,
    desconto: convenio.desconto,
  };

  // Atualizar os dados no localStorage
  db[index] = dados;
  setDB(db);

  openModalProof();
};

document
  .querySelector("#btnImprimirComprovante")
  .addEventListener("click", printOutProof);
document
  .querySelector("#confirmConvenio")
  .addEventListener("click", confirmConvenio);
document
  .querySelector("#cancelConvenio")
  .addEventListener("click", closeModalConvenio);
document
  .querySelector("#closeConvenio")
  .addEventListener("click", closeModalConvenio);
