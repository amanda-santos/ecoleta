import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { FiUpload } from 'react-icons/fi';

import './styles.css'; 

interface Props {
  onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState('');

  // após o usuário enviar o arquivo, pega a url do arquivo e a salva em selectedFileUrl
  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    const fileUrl = URL.createObjectURL(file);
    setSelectedFileUrl(fileUrl);
    
    onFileUploaded(file);
  }, [onFileUploaded])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: 'image/*'
  })

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />
      {/* se o selectedFileUrl existir (imagem cadastrada), exibe a imagem; senão, exibe as mensagens */}
      { selectedFileUrl
        ? <img src={selectedFileUrl} alt="Point thumbnail" />
        : (
          isDragActive ?
          <p>Solte o arquivo aqui...</p> :
          <p><FiUpload />Arraste e solte um arquivo aqui ou clique para selecionar um arquivo</p>
        )
      }

    </div>
  )
}

export default Dropzone;