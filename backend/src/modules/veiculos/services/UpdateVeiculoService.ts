import { hash } from 'bcryptjs';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Veiculo from '../infra/typeorm/entities/Veiculo';
import IVeiculosRepository from '../repositories/IVeiculosRepository';
import ITagsRepository from '@modules/tags/repositories/ITagsRepository';

interface IRequest {
  veiculo_id: number;
  placa: string;
  renavam?: string;
  cor: string;
  marca: string;
  modelo: string;
  tag_id?: number;
}

@injectable()
class UpdateVeiculoService {
  constructor(
    @inject('VeiculosRepository')
    private veiculosRepository: IVeiculosRepository,

    @inject('TagsRepository')
    private tagsRepository: ITagsRepository,
  ) {}

  public async execute({
    veiculo_id,
    placa,
    renavam,
    cor,
    marca,
    modelo,
    tag_id,
  }: IRequest): Promise<Veiculo> {
    const veiculo: any = await this.veiculosRepository.findById(veiculo_id);

    if (!veiculo) {
      throw new AppError('Veiculo não existe.', 404);
    }

    if (placa) {
      veiculo.placa = placa;
    }
    if (renavam) {
      veiculo.renavam = renavam;
    }
    if (cor) {
      veiculo.cor = cor;
    }
    if (marca) {
      veiculo.marca = marca;
    }
    if (modelo) {
      veiculo.modelo = modelo;
    }
    if (tag_id) {
      const tag = await this.tagsRepository.findById(tag_id);

      if (!tag) {
        throw new AppError('Tag não existente', 404);
      }

      veiculo.tag = Promise.resolve(tag);
    }

    await this.veiculosRepository.save(veiculo);

    return veiculo;
  }
}

export default UpdateVeiculoService;