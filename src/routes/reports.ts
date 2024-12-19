import { getPayers, handleRequiredDocumentsReport } from '../services'
import { ApiV1OrgProvidersListProvidersMetadataParam } from '@api/medallion-api/types'
import { EReportType } from '../types'
import { Router } from 'express'
import express, { Request, Response, NextFunction } from "express";
import { AppError } from 'attain-aba-shared';


const router = express.Router();
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
     const reportType = req.query?.reportType
     const state = req.query?.state?.toString() as ApiV1OrgProvidersListProvidersMetadataParam['license_state']
     try {
          switch (reportType) {
               case EReportType.PROVIDER_REQUIRED_DOCUMENTS:
                    res.status(200).json(await handleRequiredDocumentsReport())
               case EReportType.PAYER_LIST:
                    if (!state) {
                         throw new Error('Invalid State')
                    } else {
                         const payers = await getPayers(state)
                         if (!payers) {
                              throw new Error('Failed to get Payors')
                         }
                         res.status(200).json(payers)
                    }
               default:
                    throw new Error('Invalid Report type')
          }
     } catch (error) {
          next(new AppError((error as Error).message, 500))
     }
})

async function handleReports(request: HttpRequest): Promise<HttpResponseInit> {
     const reportType = request.query.get('reportType')
     const state = request.query
          .get('state')
          ?.toString() as ApiV1OrgProvidersListProvidersMetadataParam['license_state']
     try {
          switch (reportType) {
               case EReportType.PROVIDER_REQUIRED_DOCUMENTS:
                    return {
                         body: JSON.stringify(
                              await handleRequiredDocumentsReport()
                         ),
                    }
               case EReportType.PAYER_LIST:
                    if (!state) {
                         throw new Error('Invalid State')
                    } else {
                         const payers = await getPayers(state)
                         if (!payers) {
                              throw new Error('Failed to get Payors')
                         }
                         return { body: JSON.stringify(payers) }
                    }
               default:
                    throw new Error('Invalid Report type')
          }
     } catch (error) {
          return {
               body: JSON.stringify({
                    error:
                         (error as Error).message ||
                         'An unknown error occurred',
               }),
               status: 500,
          }
     }
}
