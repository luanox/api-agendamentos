import IParseMailTempĺateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTempĺateDTO';

interface IMailContact {
    name: string;
    email: string;
}

export default interface ISendMailDTO {
    to: IMailContact;
    from?: IMailContact;
    subject: string;
    templateData: IParseMailTempĺateDTO;
}