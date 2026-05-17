import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: ['log', 'error', 'warn', 'debug', 'verbose'],
        rawBody: true,
    });

    app.enableCors({
        origin: ['http://localhost:5173', 'http://23.239.111.164:5173'],
        credentials: true,
    });

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            forbidUnknownValues: true,
            exceptionFactory(errors) {
                const formattedErrors = errors.map((error) => ({
                    field: error.property,
                    message: error.constraints
                        ? Object.values(error.constraints)[0]
                        : 'Invalid value',
                }));

                return new BadRequestException({
                    message: formattedErrors,
                });
            },
        }),
    );
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.use(cookieParser());
    // ONLY NEED WHEN SERVER UPLOAD STATIC ASSET
    // app.useStaticAssets(join(process.cwd(), 'uploads'), {
    //     prefix: '/uploads/',
    // });
    const port = app.get(ConfigService).get<number>('PORT');

    const config = new DocumentBuilder()
        .setTitle('Swagger API')
        .setDescription('The API description')
        .setVersion('1.0')
        .build();
    app.setGlobalPrefix('api/v1', {
        exclude: ['/'],
    });
    const documentFactory = () => SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, documentFactory);

    await app.listen(port as number);
}
bootstrap();
