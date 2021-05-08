import { Test } from '@nestjs/testing';
import * as fs from 'fs';

var streamBuffers = require('stream-buffers');

import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

// Mock TasksService
const mockTasksService = () => ({
    createTask: jest.fn(),
});

describe('TasksController', () => {
    let taskController: TasksController;
    let taskService: TasksService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
        providers: [
            TasksController,
            { provide: TasksService, useFactory: mockTasksService },
        ],
        }).compile();

        taskController = module.get<TasksController>(TasksController);
        taskService = module.get<TasksService>(TasksService);
    });

    it('should be defined', () => {
        expect(taskController).toBeDefined();
    });

    describe('Test add new task method', () => {
        it('should Test add new task method of TasksController', async () => {
            // Add mock file for create task
            const fileToBuffer = (filename) => {
                const readStream = fs.createReadStream(filename);
                const chunks = [];
                return new Promise((resolve, reject) => {
                  // Handle any errors while reading
                  readStream.on('error', (err) => {
                    // handle error
                    // File could not be read
                    reject(err);
                  });
              
                  // Listen for data
                  readStream.on('data', (chunk) => {
                    chunks.push(chunk);
                  });
              
                  // File is done being read
                  readStream.on('close', () => {
                    // Create a buffer of the image from the stream
                    resolve(Buffer.concat(chunks));
                  });
                });
            };

            const imageBuffer = (await fileToBuffer('./uploads/testImage.png')) as Buffer;
            let media: Express.Multer.File;
            const myReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer({
            frequency: 10, // in milliseconds.
            chunkSize: 2048, // in bytes.
            });
            myReadableStreamBuffer.put(imageBuffer as Buffer);
            media = {
                buffer: imageBuffer,
                fieldname: 'fieldname-defined-in-@UseInterceptors-decorator',
                originalname: 'original-filename',
                encoding: '7bit',
                mimetype: 'file-mimetyp',
                destination: 'destination-path',
                filename: 'file-name',
                path: 'file-path',
                size: 955578,
                stream: myReadableStreamBuffer,
            };

            const mTaskData = {
                title: 'Task 1',
                description: 'Short description',
                target_date: '2021-05-08T03:27:21.575Z',
                status: 'In Progress',
            };
            await taskController.createTask(media, mTaskData);
            expect(taskService.createTask).toHaveBeenCalled();
            expect(taskService.createTask).toBeCalledTimes(1);
        });
    });

}); 