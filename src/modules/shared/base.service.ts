import { HttpCode, Injectable, Logger } from '@nestjs/common';
import { Response } from 'express';
import { STATUS_CODES } from 'http';
import { Model } from 'mongoose';
import { IUserDocument } from '../user/user.schema';

export class BaseService {

    private logger = new Logger(BaseService.name)
    repository: Model<any>;
    constructor(repository: Model<any>) {
        this.repository = repository;
    }

    createModel = async <T>(data: any) => await this.repository.create(data);

    /**
     * Find All
     * @returns Object
     */
    all = (condition?: {}) => this.repository.find(condition);

    /**
     * Find By ID
     * @param id Object ID
     * @returns Object
     */
    byId = (id: string) => this.repository.findById(id);
    
    /**
     * Update Object
     * @param id Object ID
     * @param data Queries to update
     * @returns New Object ID
     */
    findByIdAndUpdate = async <T>(id: string, data: any): Promise<T> => await this.repository.findByIdAndUpdate(id, data, { new: true });

    //------------------------------ Responses -------------------------- //

    response = (res: Response, status: number, data: any, message: string, options = {}): Response<any> => {
        return res.status(status).json({ statusCode: status, data, message, ...options });
    }


    
}
