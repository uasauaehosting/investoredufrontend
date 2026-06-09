import { FormEvent, useState } from 'react';
import PageHeader from '../components/PageHeader';
import ProgramsResultsTable from '../components/programs/ProgramsResultsTable';
import { api } from '../lib/api';
import { PROGRAM_FILTER_GROUPS, PROGRAM_MEMBERS, getLabelsFromSelect } from '../lib/programFilters';

interface Program {
  id: number;
  member_name: string;
  general_info: string[];
  education_materials: string[];
  specific_materials: string[];
  assisting_groups: string[];
  evaluation: string[];
  successful_programs: string[];
}

function parseProgramArray(value: unknown): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function matchesCategory(programValues: string[], selectedLabels: string[]): boolean {
  if (selectedLabels.length === 0) return true;
  return selectedLabels.some((label) => programValues.includes(label));
}

function filterPrograms(
  programs: Program[],
  member: string,
  filters: Record<string, string[]>,
): Program[] {
  return programs.filter((program) => {
    if (member && member !== 'Select Member' && program.member_name !== member) {
      return false;
    }

    return (
      matchesCategory(parseProgramArray(program.general_info), filters.generalInfo) &&
      matchesCategory(parseProgramArray(program.education_materials), filters.educationMaterials) &&
      matchesCategory(parseProgramArray(program.specific_materials), filters.specificMaterials) &&
      matchesCategory(parseProgramArray(program.assisting_groups), filters.assistingGroups) &&
      matchesCategory(parseProgramArray(program.evaluation), filters.evaluation) &&
      matchesCategory(parseProgramArray(program.successful_programs), filters.successfulPrograms)
    );
  });
}

export default function Programs() {
  const [results, setResults] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<string>('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const memberSelect = form.elements.namedItem('member') as HTMLSelectElement;

    const member = memberSelect.value;
    if (!member || member === 'Select Member') {
      setMessage('Please select a member.');
      setSubmitted(false);
      setResults([]);
      return;
    }

    const filters = Object.fromEntries(
      PROGRAM_FILTER_GROUPS.map((group) => [
        group.name,
        getLabelsFromSelect(form.elements.namedItem(group.name) as HTMLSelectElement),
      ]),
    ) as Record<string, string[]>;

    setSelectedMember(member);
    setMessage(null);
    setLoading(true);
    setError(null);
    setSubmitted(true);

    try {
      const response = await api.get('/programs');
      const programs: Program[] = (response?.data ?? response ?? []).map((program: Program) => ({
        ...program,
        general_info: parseProgramArray(program.general_info),
        education_materials: parseProgramArray(program.education_materials),
        specific_materials: parseProgramArray(program.specific_materials),
        assisting_groups: parseProgramArray(program.assisting_groups),
        evaluation: parseProgramArray(program.evaluation),
        successful_programs: parseProgramArray(program.successful_programs),
      }));

      setResults(filterPrograms(programs, member, filters));
    } catch {
      setError('Failed to load programs. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <PageHeader
        title="Programs"
        items={[
          { label: 'Home', href: '/' },
          { label: 'Investor Education' },
          { label: "Members' Activities", href: '/education/members-activities' },
          { label: 'Programs' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 mb-10">

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="member" className="sr-only">
                  Select Member
                </label>
                <select
                  id="member"
                  name="member"
                  defaultValue="Select Member"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-700 focus:border-[#009900] focus:outline-none focus:ring-2 focus:ring-[#009900]/20"
                >
                  <option value="Select Member">Select Member</option>
                  {PROGRAM_MEMBERS.map((member) => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
                </select>
              </div>

              {PROGRAM_FILTER_GROUPS.map((group) => (
                <div key={group.name}>
                  <label htmlFor={group.name} className="block text-sm font-bold text-[#009900] mb-2">
                    {group.title}
                  </label>
                  <select
                    id={group.name}
                    name={group.name}
                    multiple
                    size={4}
                    title={group.title}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-[#009900] focus:outline-none focus:ring-2 focus:ring-[#009900]/20"
                    style={{ height: group.options.length > 4 ? '120px' : '100px' }}
                  >
                    {group.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-lg bg-[#009900] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#006600] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Loading...' : 'Submit'}
              </button>
              {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
              {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            </div>
          </form>

          {submitted && !loading && !error && (
            <div className="mt-10 border-t border-gray-100 pt-8">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h3 className="text-lg font-bold text-[#009900]">Results</h3>
                <p className="text-sm text-gray-500">
                  {results.length} program{results.length === 1 ? '' : 's'} found
                  {selectedMember && selectedMember !== 'Select Member' && (
                    <> for {selectedMember}</>
                  )}
                </p>
              </div>

              <ProgramsResultsTable programs={results} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
