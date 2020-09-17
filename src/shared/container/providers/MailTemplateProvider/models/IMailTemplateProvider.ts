import IParseMailTemplateDTO from '../dtos/IParseMailTempĺateDTO';

export default interface IMailTemplateProvider {
    parse(date: IParseMailTemplateDTO): Promise<string>
}