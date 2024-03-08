import { Options } from 'python-shell';
import { Logger } from '@nestjs/common';

const logger = new Logger('Python Shell');

export const config: Options = {
    mode: 'json',
    pythonPath: 'C:/Program Files/Python312/python.exe',
    scriptPath: './src/suggest/scripts',
    pythonOptions: ['-u'],
    stderrParser: (log) => logger.verbose(log)
}