import * as XLSX from 'xlsx';
import DropzoneComponent from '../locations/DropzoneComponent';
import useAppContext from '../../hooks/useAppContext';
import useAuthContext from '../../hooks/useAuthContext';
import useCustomToast from '../../hooks/useCustomToast';
import useInsertData from '../../hooks/useInsertData';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import {
  Button,
  Icon,
  SlideFade,
  VStack
} from '@chakra-ui/react';
import { SiMicrosoftexcel } from 'react-icons/si';
import { useEffect, useState } from 'react';


function readXLSX(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();

    lector.onload = (evento) => {
      const datos = evento.target?.result;
      if (datos) {
        const workbook = XLSX.read(datos, { type: 'binary' });
        const primeraHoja = workbook.SheetNames[0];
        const datosConvertidos = XLSX.utils.sheet_to_json(workbook.Sheets[primeraHoja]);
        resolve(datosConvertidos);
      } else {
        reject(new Error('No se pudo leer el archivo.'));
      }
    };

    lector.readAsBinaryString(file);
  });
}

const ImportUsersView = () => {
  const {
    loading: batchLoading,
    error: batchError,
    response: batchResponse,
    insertData
  } = useInsertData()
  const { authSessionData: { accessToken } } = useAuthContext()
  const { users } = useAppContext()
  const { errorToast, successToast } = useCustomToast()
  const [files, setFiles] = useState<File[]>([])

  const handleClick = async () => {
    if (!files.length) {
      errorToast("No puedes dejar el compo vacío")
      return
    }

    try {
      const excelJSON = await readXLSX(files[0])
      const ok = await insertData("/usersbatch", excelJSON, {
        jwt: accessToken!
      })
      if (ok) {
        await users.fetch()
        successToast("Se cargó la lista de usuarios con éxito.")
      }
    } catch (error) {
      const err = error as Error
      errorToast(err.message)
    }
  }

  useEffect(() => {
    if(batchError){
      errorToast(batchError)
    }
  }, [batchError])

  useEffect(() => {
    if (batchResponse) {
      console.log(batchResponse)
    }
  }, [batchResponse])

  return (
    <VStack align='stretch'>
      <DropzoneComponent
        placeholder='Subir excel'
        icon={SiMicrosoftexcel}
        maxFiles={1}
        multiple={false}
        onDrop={files => setFiles(files)}
        accept={{
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        }} />
      <SlideFade offsetX='0px' offsetY='10px' in={!!files.length}>
        <Button
          w="full"
          colorScheme='green'
          loadingText='Creando'
          isLoading={batchLoading}
          leftIcon={
            <Icon as={AiOutlineCloudUpload} />
          }
          onClick={handleClick}>Cargar</Button>
      </SlideFade>
    </VStack>
  )
}

export default ImportUsersView