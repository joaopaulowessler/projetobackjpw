import {BodyParams, Controller, Delete, Get, PathParams, Post, Put, Required, Status} from "@tsed/common";
import {NotFound} from "ts-httpexceptions";
import {PessoaService} from "../../services/pessoa/PessoaService";
import {Pessoa} from "../../interfaces/Pessoa";
import { LocacaoService } from "../../services/locacao/LocacaoService";

@Controller("/pessoa")
export class PessoaCtrl {

    constructor(private pessoaService: PessoaService, private locacaoService: LocacaoService) {}

    @Post("/")
    async save(@BodyParams() pessoa: Pessoa): Promise<Pessoa> {

        const pes = await this.pessoaService.create(pessoa);

        if (pes) {
            return pes;
        } else{
            throw new NotFound("Erro ao incluir");
        }
    }

    @Get("/")
    async getAllPessoa(): Promise<Pessoa[]> {

        const pessoas = await this.pessoaService.query();

        if (pessoas) {
            return pessoas;
        } else{
            throw new NotFound("Nenhuma pessoa encontrada");
        }
    }

    @Get("/arquivo/")
    async arquivo(): Promise<Pessoa[]> {

        const pessoas = await this.pessoaService.query();

        if (pessoas) {

            return pessoas;
        } else{
            throw new NotFound("Nenhuma pessoa encontrada");
        }
    }

    @Get("/:id")
    async findById(@Required() @PathParams("id") id: string): Promise<Pessoa> {

        const pessoa = await this.pessoaService.findById(id);

        if (pessoa) {
            return pessoa;
        } else{
            throw new NotFound("Pessoa inexistente");
        }
    }

    @Put("/:id")
    async update(@PathParams("id") @Required() id: string,
                 @BodyParams() @Required() pessoa: Pessoa): Promise<Pessoa> {

        const pes = await this.pessoaService.update(id, pessoa);
        if (pes) {
            return pessoa;
        } else{
            throw new NotFound("Erro ao atualizar pessoa");
        }
    }

    @Delete("/:id")
    @Status(204)
    async remove(@PathParams("id") @Required() id: string){
        this.pessoaService.remove(id);
        this.locacaoService.removeLocPessoa(id);
    }
}