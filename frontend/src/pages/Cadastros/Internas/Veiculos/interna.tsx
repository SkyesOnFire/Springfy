import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { AxiosError, AxiosResponse } from 'axios';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { useToast } from 'hooks/toast';
import api from 'services/api';
import FormConstructor, { IInput, ISaveBtn } from 'components/FormConstructor';
import getValidationErrors from 'utils/getValidationErrors';

import Spinner from 'components/Spinner';
import { Container, BodyHolder } from '../interna-styles';
import { TitleHolder } from '../styles';

interface ParamsTypes {
  id: string | undefined;
}

const VeiculosInterna: React.FC = () => {
  const module = 'veiculo';
  const module_label = 'Veiculo';

  const { id } = useParams<ParamsTypes>();

  const history = useHistory();

  const formRef = useRef<FormHandles>(null);
  const [update, setUpdate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any | undefined>(undefined);
  const { addToast } = useToast();

  const saveBtn: ISaveBtn = {
    label: 'Enviar',
    loading,
  };

  const inputs: IInput[] = [
    {
      name: 'placa',
      label: 'Placa',
      tipo: 'mask',
      required: true,
      mask: 'aaa-9*99',
    },
    {
      name: 'renavam',
      label: 'Renavam',
      tipo: 'input',
    },
    {
      name: 'cor',
      label: 'Cor',
      tipo: 'input',
      required: true,
    },
    {
      name: 'marca',
      label: 'Marca',
      tipo: 'input',
      required: true,
    },
    {
      name: 'modelo',
      label: 'Modelo',
      tipo: 'input',
      required: true,
    },
  ];

  const get = useCallback(async () => {
    setLoading(true);
    await api
      .get(`/${module}s/${module}/${id}`)
      .then(async (res: AxiosResponse) => {
        setData(res.data);
      })
      .catch(err => {
        addToast({
          type: 'error',
          title:
            typeof err.response?.data.message === 'string'
              ? err.response?.data.message
              : 'Ocorreu um erro',
          description: `Ocorreu um erro ao buscar o ${module.toLocaleLowerCase()}, tente novamente.`,
        });
        console.error(`Erro: ${err}`);
      })
      .finally(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addToast, id, module, update]);

  useEffect(() => {
    get();
  }, [get]);

  const handleSubmit = useCallback(
    async (dat: any) => {
      try {
        setLoading(true);

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          placa: Yup.string().required('Placa do veículo obrigatória'),
          cor: Yup.string().required('Cor do veículo obrigatória'),
          marca: Yup.string().required('Marca do veículo obrigatória'),
          modelo: Yup.string().required('Modelo do veículo obrigatório'),
        });

        await schema.validate(dat, {
          abortEarly: false,
        });

        api
          .put(`/${module}s/${module}/${id}`, dat)
          .then((res: AxiosResponse) => {
            const { id: idd } = res.data;
            addToast({
              type: 'success',
              title: `${module_label}${
                idd && ` de id: ${idd}`
              } atualizado com sucesso`,
            });
            history.push(`/${module}s`);
            setUpdate(!update);
          })
          .catch((err: AxiosError) => {
            addToast({
              type: 'error',
              title:
                typeof err.response?.data.message === 'string'
                  ? err.response?.data.message.charAt(0).toUpperCase() +
                    err.response?.data.message.slice(1)
                  : 'Ocorreu um erro',
              description: `Ocorreu um erro ao atualizar o ${module}, cheque as informações e tente novamente.`,
            });
            console.error(`Erro: ${err}`);
          });
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
        }

        addToast({
          type: 'error',
          title: err.message || `Erro na atuaização do ${module}`,
          description: `Ocorreu um erro ao atualizar o ${module}, cheque as informações e tente novamente.`,
        });
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [addToast, id, update]
  );

  return (
    <Container>
      {data ? (
        <>
          <BodyHolder>
            <TitleHolder>
              {module_label} #{id}:
            </TitleHolder>
            <FormConstructor
              color="quaternary"
              formColumns="1fr 1fr"
              formRef={formRef}
              inputs={inputs}
              saveBtn={saveBtn}
              submitFnc={handleSubmit}
              initialData={data}
            />
          </BodyHolder>
        </>
      ) : loading ? (
        <Spinner size={15} />
      ) : (
        `${
          module.lastIndexOf('s') === module.length - 1
            ? module.slice(0, -1)
            : module
        } não encontrado...`
      )}
    </Container>
  );
};

export default VeiculosInterna;
