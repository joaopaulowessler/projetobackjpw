import {BodyParams, Controller, Delete, Get, PathParams, Post, Put, Required, Status, MergeParams, Header, ContentType} from "@tsed/common";
import {NotFound} from "ts-httpexceptions";
import {LocacaoService} from "../../services/locacao/LocacaoService";
import {Locacao} from "../../interfaces/Locacao";
import {PessoaService} from "../../services/pessoa/PessoaService";
import {json2csv} from "json-2-csv-ts";
import { writeFileSync, readFileSync } from "fs";

@Controller("/locacao")
@MergeParams(true)
export class LocacaoCtrl {

    constructor(private locacaoService: LocacaoService, private pessoaService: PessoaService) {}

    @Post("/")
    async save(@BodyParams() locacao: Locacao): Promise<Locacao> {

        const pessoa = await this.pessoaService.findById(locacao.id_pessoa);

        if (pessoa) {

            const valorConvertido = await this.locacaoService.getMoeda("USD", "BRL", Number(locacao.valor));
            locacao.valor_dolar = Number(locacao.valor) / Number(valorConvertido.data["USD_BRL"]);

            const loc = await this.locacaoService.create(locacao);

            if (loc) {
                return loc;
            } else{
                throw new NotFound("Erro ao incluir");
            }
        } else{
            throw new NotFound("Pessoa informada nao esta cadastrada");
        }
    }

    @Get("/")
    async getAllLocacao(): Promise<Locacao[]> {

        const locacoes = await this.locacaoService.query();

        if (locacoes) {
            return locacoes;
        } else{
            throw new NotFound("Nenhuma locacao encontrada");
        }
    }

    @Get("/report/")
    @Header("content-disposition", "attachment;fileName=locacaoReport.csv")
    @ContentType('text/csv')
    async report(){

        let locacoes = await this.locacaoService.query();
        writeFileSync(__dirname + '/report.csv', json2csv(locacoes));
        return readFileSync(__dirname + '/report.csv', 'utf8');
    }

    @Get("/total/:id")
    async totalPessoa(@Required() @PathParams("id") id: string): Promise<any> {

        const pessoa = await this.pessoaService.findById(id);

        if (pessoa) {

            const total = await this.locacaoService.totalPessoa(id);

            if (total) {
                return total;
            } else{
                throw new NotFound("Nenhuma locacao encontrada para a pessoa informada");
            }
        } else{
            throw new NotFound("Pessoa informada nao esta cadastrada");
        }
    }

    /*@Get("/arquivo/")
    async arquivo(): Promise<Locacao[]> {

        const locacoes = await this.locacaoService.query();

        if (locacoes) {

            return locacoes;
        } else{
            throw new NotFound("Nenhuma locacao encontrada");
        }
    }*/

    @Get("/:id")
    async findById(@Required() @PathParams("id") id: string): Promise<Locacao> {

        const locacao = await this.locacaoService.findById(id);

        if (locacao) {
            return locacao;
        } else{
            throw new NotFound("Locacao inexistente");
        }
    }

    @Put("/:id")
    async update(@PathParams("id") @Required() id: string,
                 @BodyParams() @Required() locacao: Locacao): Promise<Locacao> {

        const valorConvertido = await this.locacaoService.getMoeda("USD", "BRL", Number(locacao.valor));

        locacao.valor_dolar = Number(locacao.valor) / Number(valorConvertido.data["USD_BRL"]);

        const pessoa = await this.pessoaService.findById(locacao.id_pessoa);

        if (pessoa) {
            const loc = await this.locacaoService.update(id, locacao);
            if (loc) {
                return locacao;
            } else{
                throw new NotFound("Erro ao atualizar locacao");
            }
        } else{
            throw new NotFound("Pessoa informada nao esta cadastrada");
        }
    }

    @Delete("/:id")
    @Status(204)
    async remove(@PathParams("id") @Required() id: string){
        this.locacaoService.remove(id);
    }
}