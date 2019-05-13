import {Service} from "@tsed/common";
import {Locacao} from "../../interfaces/Locacao";

const axios = require("axios");

const datastore = require("nedb");
const db = new datastore({filename: "doclocacao.json"});
db.loadDatabase((err) => console.log(err || "DB carregado com sucesso."));

@Service()
export class LocacaoService {

    constructor() {
    }

    async findById(id: string): Promise<Locacao> {
        return new Promise((resolve, reject) => {
            db.findOne({_id: id}, (err, locacao) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(locacao);
                }
            });
        });
    }

    async query(): Promise<Locacao[]> {
        return new Promise((resolve, reject) => {
            db.find({}, (err, locacoes) => {

                if(err) {
                    reject(err);
                } else {
                    resolve(locacoes);
                }
            });
        });
    }

    async create(locacao: Locacao): Promise<Locacao> {
        return new Promise((resolve, reject) => {
            db.insert(locacao, (err) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(locacao);
                }
            });
        });
    }

    async update(id: string, locacao: Locacao): Promise<Locacao> {

        return new Promise((resolve, reject) => {
            db.update({_id: id}, locacao, (err) => {

                if(err) {
                    reject(err);
                } else {
                    resolve(locacao);
                }
            });
        });
    }

    async remove(id: string): Promise<void> {

        return new Promise((resolve, reject) => {
            db.remove({ _id: id }, {}, err =>{
                if(err) reject(err);
            });
        });
    }

    async removeLocPessoa(id: string): Promise<void> {

        return new Promise((resolve, reject) => {
            db.remove({ id_pessoa: id }, { multi: true }, function (err, numRemoved) {
                if(err) reject(err);
            });
        });
    }

    async getMoeda(moedaOrigem: string, moedaDestino: string, valor: number): Promise<any> {
        const url = "http://free.currencyconverterapi.com/api/v6/convert?q=" + moedaOrigem + "_" + moedaDestino + "&compact=ultra&apiKey=" + "f6b4e86d590b809abab7";
        return await axios.get(url);
    }

    async totalPessoa(id: string): Promise<any> {
        
        var total : any = {};
        
        return new Promise((resolve, reject) => {
            db.find({id_pessoa: id}, (err, locacao) => {
                if(err) {
                    reject(err);
                } else {
                    console.log(locacao);

                    var vl  : number = 0;
                    var vld : number = 0;

                    locacao.forEach(function (e) {
                        vl  = vl  + Number(e.valor);
                        vld = vld + Number(e.valor_dolar);
                    });

                    total.valor = vl;
                    total.valor_dolar = vld;
                    total.quantidade = locacao.length;

                    return resolve(total);
                }
            });
        });
    }
}