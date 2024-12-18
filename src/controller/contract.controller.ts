import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOllama } from "@langchain/ollama";
import { NextFunction, Request, Response } from "express";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import contractModel from "../model/contract.model";
import userModal from "../model/user.model";
import { authRequest } from "../types/authRequest";

const getAllContracts = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const allcontracts = await contractModel.find();

    if (allcontracts.length === 0) {
      return res.status(404).json({
        message: "No contracts found",
        data: [],
      });
    }

    return res.status(200).json({
      message: "contracts fetched successfully",
      data: allcontracts,
      totalCount: allcontracts.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

const getUsersContracts = async (
  req: authRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.userId;
    console.log(userId);
    if (!userId) {
      return res.status(404).json({
        message: "Authentication Error",
      });
    }
    const allcontracts = await contractModel.find({
      $or: [{ clientId: userId }, { freelancerId: userId }],
    });

    if (allcontracts.length === 0) {
      return res.status(404).json({
        message: "No contracts found",
        data: [],
      });
    }

    return res.status(200).json({
      data: allcontracts,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
const addContract = async (req: Request, res: Response, next: NextFunction) => {
  const { clientId, freelancerId } = req.body;
  try {
    const client = await userModal.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: "client not found" });
    }

    const freelancer = await userModal.findById(freelancerId);
    if (!freelancer) {
      return res.status(404).json({ message: "freelencer  not found" });
    }
    // contractSchema.parse(req.body);
    const contract = await contractModel.create(req.body);
    return res.status(201).json({ data: contract });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        issues: error.errors?.map(
          (item, index) => `${item.path[0]} - ${item.message}`
        ),
      });
    }
    console.error(error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return res.status(500).json({ error: errorMessage });
  }
};

const genContractAi = async (req: Request, res: Response) => {
  try {
    const { role, description } = req.body;
    if (!role || !description) {
      return res.status(400).json({
        error: " Please provide 'role' and 'description' in the request body.",
      });
    }

    const ollama = new ChatOllama({
      model: "llama3.1:8b",
      baseUrl: "http://localhost:11434",
    });

    const contractSchema = z.object({
      estimatedBudget: z
        .number()
        .min(100)
        .max(100000)
        .describe("Estimated budget for the contract in INR"),
      contractDuration: z
        .number()
        .min(1)
        .max(90)
        .describe("Contract duration in days"),
      numRevisions: z
        .number()
        .min(1)
        .max(5)
        .describe("Number of revisions allowed"),
      contractName: z.string().min(5).max(100).describe("Name of the contract"),
      contractDescription: z
        .string()
        .min(10)
        .max(500)
        .describe("Detailed description of the contract"),
    });
    const parser = StructuredOutputParser.fromZodSchema(contractSchema);
    const prompt = PromptTemplate.fromTemplate(`
      Based on the description: "${description}", 
      generate a contract with following requirements:
      
      1. Provide realistic and precise contract details
      2. Ensure budget is reasonable
      3. Set appropriate contract duration
      4. Define sensible number of revisions

      {format_instructions}

      please provide pure json result
    `);

    const chain = prompt.pipe(ollama).pipe(parser);

    console.log(parser.getFormatInstructions());
    const llmResponse = await chain.invoke({
      description: description,
      format_instructions: parser.getFormatInstructions(),
    });

    console.log(llmResponse);

    return res.status(200).json({
      data: {
        Response: [
          {
            Question: "Will you be creating it as a buyer or a seller?",
            answer: role,
          },
          {
            Question: "What will be your Contract name?",
            answer: llmResponse.contractName, // In case contract name is missing
          },
          {
            Question: "Description",
            answer: llmResponse.contractDescription,
          },
          {
            Question: "What will be your project llmResponse?",
            answer: llmResponse.estimatedBudget,
          },
          {
            Question: "What will be your Contract deadline?",
            answer: llmResponse.contractDuration,
          },
          {
            Question: "Ownership rights",
            answer: role,
          },
          {
            Question: "Number of revisions",
            answer: llmResponse.numRevisions,
          },
        ],
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return res.status(500).json({ error: errorMessage });
  }
};

export { addContract, genContractAi, getAllContracts, getUsersContracts };
