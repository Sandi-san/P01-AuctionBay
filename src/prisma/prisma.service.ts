//POVEZAVA Z DB

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(config: ConfigService) {
        //constructor od PrismaClient
        super({
            datasources: {
                db:{
                    url: config.get('DATABASE_URL')
                }
            }
        })
    }

    cleanDB(){
        //delete najprej bookmarks & nato users (transaction)
        return this.$transaction([
            this.user.deleteMany(),
            this.auction.deleteMany(),
            this.bid.deleteMany(),
        ])
    }
}
