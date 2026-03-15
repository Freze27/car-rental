import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { fieldExtensionsEstimator, simpleEstimator, getComplexity } from 'graphql-query-complexity';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';
import { CarModule } from './car/car.module';
import { RentModule } from './rent/rent.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: false,
      introspection: true,
      csrfPrevention: false,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault({ embed: true }),
        {
          async requestDidStart({ schema }) {
            return {
              async didResolveOperation({ request, document }) {
                const complexity = getComplexity({
                  schema,
                  operationName: request.operationName,
                  query: document,
                  variables: request.variables,
                  estimators: [
                    fieldExtensionsEstimator(),
                    simpleEstimator({ defaultComplexity: 1 }),
                  ],
                });
                const MAX_COMPLEXITY = 100;
                if (complexity > MAX_COMPLEXITY) {
                  throw new Error(
                    `Query complexity ${complexity} exceeds maximum allowed ${MAX_COMPLEXITY}`,
                  );
                }
              },
            };
          },
        },
      ],
    }),
    CarModule,
    RentModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
