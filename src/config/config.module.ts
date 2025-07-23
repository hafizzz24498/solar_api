import { Module } from "@nestjs/common";
import appConfig from "./app.config";
import { ConfigModule as  NestConfigModule} from "@nestjs/config";

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            load: [() => ({ app: appConfig() })],
        })
    ]
})
export class ConfigModule {
    
}