import {Service} from "@tsed/common";
import {Pessoa} from "../../interfaces/Pessoa";

const datastore = require("nedb");
const db = new datastore({filename: "documents.json"});
db.loadDatabase((err) => console.log(err || "DB carregado com sucesso."));

@Service()
export class PessoaService {

    constructor() {
    }

    async findById(id: string): Promise<Pessoa> {
        return new Promise((resolve, reject) => {
            db.findOne({_id: id}, (err, pessoa) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(pessoa);
                }
            });
        });
    }

    async query(): Promise<Pessoa[]> {
        return new Promise((resolve, reject) => {
            db.find({}, (err, pessoas) => {

                if(err) {
                    reject(err);
                } else {
                    resolve(pessoas);
                }
            });
        });
    }

    async create(pessoa: Pessoa): Promise<Pessoa> {
        return new Promise((resolve, reject) => {
            db.insert(pessoa, (err) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(pessoa);
                }
            });
        });
    }

    async update(id: string, pessoa: Pessoa): Promise<Pessoa> {

        return new Promise((resolve, reject) => {
            db.update({_id: id}, pessoa, (err) => {

                if(err) {
                    reject(err);
                } else {
                    resolve(pessoa);
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
}