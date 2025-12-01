import { Controller, Get, Res } from '@nestjs/common';
import { join } from 'path';
import { readFileSync } from 'fs';
import { Response } from 'express';

@Controller('doc')
export class DocController {
  @Get()
  getDoc(@Res() res: Response) {
    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>API Docs</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <redoc spec-url="/doc/api.yaml"></redoc>
    <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
  </body>
</html>`;
    res.type('text/html').send(html);
  }

  @Get('api.yaml')
  getYaml(@Res() res: Response) {
    const filePath = join(process.cwd(), 'doc', 'api.yaml');
    try {
      const content = readFileSync(filePath, 'utf8');
      res.type('text/yaml').send(content);
    } catch (err) {
      res.status(404).send('API spec not found');
    }
  }
}
